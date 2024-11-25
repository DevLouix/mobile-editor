import { NextApiRequest, NextApiResponse } from "next";
import * as git from "isomorphic-git";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dir, author, message } = req.body;

  if (!dir || !author || !author.name || !author.email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check the status matrix for changes
    const status = await git.statusMatrix({ fs, dir });

    let hasChanges = false;

    // Stage changes (add modified and new files, remove deleted files)
    for (const [filepath, headStatus, worktreeStatus, stageStatus] of status) {
      if (worktreeStatus !== stageStatus) {
        hasChanges = true;

        if (worktreeStatus === 0) {
          // File is deleted, stage for removal
          await git.remove({ fs, dir, filepath });
        } else {
          // File is new or modified, stage for addition
          await git.add({ fs, dir, filepath });
        }
      }
    }

    if (!hasChanges) {
      return res.status(200).json({ message: "No changes to commit." });
    }

    // Make the commit
    const sha = await git.commit({
      fs,
      dir,
      author,
      message,
    });

    // Respond with the commit SHA
    res.status(200).json({ sha });
  } catch (error: any) {
    console.error("Error making commit:", error);
    res.status(500).json({ error: "Failed to make the commit", details: error.message });
  }
}
