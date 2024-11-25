import { NextApiRequest, NextApiResponse } from "next";
import * as git from "isomorphic-git";
import fs from "fs";
import http from "isomorphic-git/http/node";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dir, remote, branch, token } = req.body;

  if (!dir || !remote || !branch || !token) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify the directory exists
    if (!fs.existsSync(dir)) {
      return res.status(404).json({ error: "Repository directory does not exist." });
    }

    // Configure the remote if not already set
    const remotes = await git.listRemotes({ fs, dir });
    const originRemote = remotes.find((r) => r.remote === "origin");
    if (!originRemote || originRemote.url !== remote) {
      if (originRemote) {
        await git.deleteRemote({ fs, dir, remote: "origin" });
      }
      await git.addRemote({ fs, dir, remote: "origin", url: remote });
      console.log("Remote 'origin' set to:", remote);
    }

    // Perform the pull operation
    await git.pull({
      fs,
      http,
      dir,
      remote: "origin",
      ref: branch,
      singleBranch: true,
      onAuth: () => ({ username: "oauth2", password: token }),
      onProgress: (progress) => {
        console.log(
          `Pull progress: ${progress.phase} ${progress.loaded}/${progress.total}`
        );
      },
    });

    console.log("Pull completed successfully.");
    return res.status(200).json({ message: "Pull completed successfully." });
  } catch (error: any) {
    console.error("Git pull error:", error);
    return res
      .status(500)
      .json({ error: "Failed to pull changes.", details: error.message });
  }
}
