import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import * as git from "isomorphic-git";
import fs from "fs";
import http from "isomorphic-git/http/node";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { repoPath, remote, branch } = req.body;

  if (!repoPath || !branch) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // Verify that the repository path exists
    if (!fs.existsSync(repoPath)) {
      return res
        .status(404)
        .json({ message: "Repository path does not exist." });
    }

    const token = session.accessToken as string;

    // Check and set the remote
    const remotes = await git.listRemotes({ fs, dir: repoPath });
    const originRemote = remotes.find((r) => r.remote === "origin");
    if (!originRemote || originRemote.url !== remote) {
      // Add or update the origin remote
      if (originRemote) {
        await git.deleteRemote({ fs, dir: repoPath, remote: "origin" });
      }
      await git.addRemote({ fs, dir: repoPath, remote: "origin", url: remote });
      console.log("Remote 'origin' set to:", remote);
    } else {
      console.log("Remote 'origin' is already correctly set.");
    }

    // Stage all files
    await git.add({ fs, dir: repoPath, filepath: "." });
    console.log("Files staged.");

    // Commit the changes
    await git.commit({
      fs,
      dir: repoPath,
      author: {
        name: session.user?.name || "Anonymous",
        email: session.user?.email || "anonymous@example.com",
      },
      message: "Committing changes to push",
    });
    console.log("Changes committed.");

    // Push to remote
    await git.push({
      fs,
      http,
      dir: repoPath,
      remote: "origin", // Ensure 'origin' is correctly set to the provided remote URL
      ref: branch,
      force:true,
      onAuth: () => ({ username: "oauth2", password: token }),
      onProgress: (progress) => {
        console.log(
          `Progress: ${progress.phase} ${progress.loaded}/${progress.total}`
        );
      },
    });
    console.log("Changes pushed successfully.");

    return res.status(200).json({ message: "Changes pushed successfully." ,repoPath});
  } catch (error: any) {
    console.error("Git push error:", error);
    return res
      .status(500)
      .json({ message: "Failed to push changes.", error: error.message });
  }
}
