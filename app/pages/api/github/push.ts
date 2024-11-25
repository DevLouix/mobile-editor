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
    // Verify the repository path exists
    if (!fs.existsSync(fullPath)) {
      return res
        .status(404)
        .json({ message: "Repository path does not exist." });
    }

    const token = session.accessToken as string;

    // Add or update the origin remote
    const remotes = await git.listRemotes({ fs, dir: fullPath });
    const originRemote = remotes.find((r) => r.remote === "origin");
    if (!originRemote || originRemote.url !== remote) {
      if (originRemote) {
        await git.deleteRemote({ fs, dir: fullPath, remote: "origin" });
      }
      await git.addRemote({ fs, dir: fullPath, remote: "origin", url: remote });
    }

    // Add `.gitkeep` to empty directories
    const ensureGitKeep = (directory: string) => {
      const entries = fs.readdirSync(directory);
      if (entries.length === 0) {
        fs.writeFileSync(path.join(directory, ".gitkeep"), "");
      } else {
        for (const entry of entries) {
          const entryPath = path.join(directory, entry);
          if (fs.statSync(entryPath).isDirectory()) {
            ensureGitKeep(entryPath);
          }
        }
      }
    };
    ensureGitKeep(fullPath);

    // Check for uncommitted changes
    const status = await git.statusMatrix({ fs, dir: fullPath });
    const hasUncommittedChanges = status.some(
      ([, , worktreeStatus, stagedStatus]) =>
        worktreeStatus !== stagedStatus || worktreeStatus !== 1
    );

    if (hasUncommittedChanges) {
      // Stage all changes
      await git.add({ fs, dir: fullPath, filepath: "." });

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
    }

    // Push to remote
    await git.push({
      fs,
      http,
      dir: fullPath,
      remote: "origin",
      ref: branch,
      onAuth: () => ({ username: "oauth2", password: token }),
    });

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
