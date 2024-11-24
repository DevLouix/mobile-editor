import { NextApiRequest, NextApiResponse } from "next";
import * as git from "isomorphic-git";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract parameters from the request body
    const { repoPath, commitMessage, authorName, authorEmail } = req.body;

    // Validate input
    if (!repoPath) {
      return res.status(400).json({ message: "Repository path is required." });
    }
    if (!authorName || !authorEmail) {
      return res.status(400).json({ message: "Author name and email are required." });
    }

    // Resolve the repository path
    const dir = path.resolve(repoPath);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Initialize the Git repository
    await git.init({ fs, dir, defaultBranch: "main" });
    console.log("Repository initialized.");

    // Add all files in the repository
    await git.add({ fs, dir, filepath: "." });
    console.log("All files added to staging.");

    // Perform the initial commit
    const sha = await git.commit({
      fs,
      dir,
      message: commitMessage || "Initial commit",
      author: {
        name: authorName,
        email: authorEmail,
      },
    });
    console.log("Initial commit created:", sha);

    return res.status(200).json({
      message: "Repository initialized and initial commit created.",
      commitSha: sha,
    });
  } catch (error: any) {
    console.error("Error initializing repository:", error);
    return res.status(500).json({ message: "Failed to initialize repository.", error: error.message });
  }
}
