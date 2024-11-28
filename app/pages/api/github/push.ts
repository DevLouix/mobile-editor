import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import * as git from "isomorphic-git";
import fs from "fs";
import http from "isomorphic-git/http/node";
import { authOptions } from "../auth/[...nextauth]";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const BASE_DIR = "/tmp";

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { repoPath, remote, branch } = req.body;

  let fullPath;
  if (repoPath?.startsWith("/tmp")) {
    fullPath = repoPath;
  } else {
    fullPath = path.join(BASE_DIR, repoPath);
  }

  if (!repoPath || !branch) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // Verify that the repository path exists
    if (!fs.existsSync(fullPath)) {
      return res
        .status(404)
        .json({ message: "Repository path does not exist." });
    }

    const token = session.accessToken as string;

    // Check and set the remote
    const remotes = await git.listRemotes({ fs, dir: fullPath });
    const originRemote = remotes.find((r) => r.remote === "origin");
    if (!originRemote || originRemote.url !== remote) {
      // Add or update the origin remote
      if (originRemote) {
        await git.deleteRemote({ fs, dir: fullPath, remote: "origin" });
      }
      await git.addRemote({ fs, dir: fullPath, remote: "origin", url: remote });
      console.log("Remote 'origin' set to:", remote);
    } else {
      console.log("Remote 'origin' is already correctly set.");
    }

    // Check for uncommitted changes
    const status = await git.statusMatrix({ fs, dir: fullPath });
    const hasUncommittedChanges = status.some(
      ([, , worktreeStatus, stagedStatus]) =>
        worktreeStatus !== stagedStatus || worktreeStatus !== 1
    );

    if (hasUncommittedChanges) {
      console.log("Uncommitted changes detected. Preparing to stage and commit.");

      // Stage all additions and modifications
      await git.add({ fs, dir: fullPath, filepath: "." });

      // Explicitly stage deletions
      for (const [filePath, , worktreeStatus] of status) {
        if (worktreeStatus === 0) {
          await git.remove({ fs, dir: fullPath, filepath: filePath });
          console.log(`Deleted file staged: ${filePath}`);
        }
      }

      // Commit the changes
      await git.commit({
        fs,
        dir: fullPath,
        author: {
          name: session.user?.name || "Anonymous",
          email: session.user?.email || "anonymous@example.com",
        },
        message: "Committing changes to push",
      });
      console.log("Changes committed.");
    } else {
      console.log("No uncommitted changes to stage or commit.");
    }

    // Push to remote
    await git.push({
      fs,
      http,
      dir: fullPath,
      remote: "origin",
      ref: branch,
      onAuth: () => ({ username: "oauth2", password: token }),
      onProgress: (progress) => {
        console.log(
          `Progress: ${progress.phase} ${progress.loaded}/${progress.total}`
        );
      },
    });
    console.log("Changes pushed successfully.");

    return res
      .status(200)
      .json({ message: "Changes pushed successfully.", repoPath });
  } catch (error: any) {
    console.error("Git push error:", error);
    return res
      .status(500)
      .json({ message: "Failed to push changes.", error: error.message });
  }
}
