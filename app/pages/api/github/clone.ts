// pages/api/clone.ts
import { NextApiRequest, NextApiResponse } from "next";
import git, { FsClient } from "isomorphic-git";
import http from "isomorphic-git/http/web"; // Use 'http/node' if on server
import fs from "fs";
import path from "path";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse repository URL from the request body
    const { repoUrl, dir } = req.body;
    if (!repoUrl) {
      res.status(400).json({ error: "Repository URL is required" });
      return;
    }

    // Clone the repository into a local directory
    const _dir = `/tmp/${dir}`; // Temporary directory for clone
    await git.clone({
      fs: fs as FsClient, // Type assertion for isomorphic-git
      http: http,
      dir: _dir,
      url: repoUrl,
      depth: 1, // Shallow clone
    });

    // Function to get the entire directory structure recursively
    const getDirectoryStructure: any = (dir: string) => {
      return fs.readdirSync(dir).map((file) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        return {
          name: file,
          isDirectory,
          path: filePath,
          children: isDirectory ? getDirectoryStructure(filePath) : null, // Recursively add children if it's a directory
        };
      });
    };
    const repoDir = getDirectoryStructure(_dir);
    res
      .status(200)
      .json({
        message: "Repository cloned successfully",
        dir,
        repoDir,
        dirPath: _dir,
      });
  } catch (error: any) {
    console.error("Error cloning repository:", error);
    res.status(500).json({ error: error.message });
  }
}

export default handler;
