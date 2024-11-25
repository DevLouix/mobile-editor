import { NextApiRequest, NextApiResponse } from "next";
import * as git from "isomorphic-git";
import fs from "fs";
import path from "path";
import http from "isomorphic-git/http/node";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust the path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { repoPath, remoteUrl } = req.body;

    // Validate input
    if (!repoPath) {
      return res.status(400).json({ message: "Repository path is required." });
    }

    if (!remoteUrl) {
      return res.status(400).json({ message: "Remote URL is required." });
    }

    // Get the session user
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email || !session?.user?.name) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated." });
    }

    const dir = path.resolve(repoPath);

    // Step 1: Remove existing .git folder if it exists
    const gitDir = path.join(dir, ".git");
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
      console.log(".git directory removed.");
    }

    // Step 2: Initialize the repository
    await git.init({ fs, dir, defaultBranch: "main" });
    console.log("Repository initialized with 'main' as the default branch.");

    // Step 3: Create a README.md file
    const readmePath = path.join(dir, "README.md");
    fs.writeFileSync(
      readmePath,
      "# CodeWhirl Editor\nThis is an auto-gen file."
    );
    console.log("README.md file created.");

    // Step 4: Add README.md to the repository
    await git.add({ fs, dir, filepath: "README.md" });
    console.log("README.md file added to staging.");

    // Step 5: Commit the changes
    const author = {
      name: session.user.name,
      email: session.user.email,
    };

    const commitSha = await git.commit({
      fs,
      dir,
      message: "Initial commit",
      author,
    });
    console.log("Initial commit created:", commitSha);

    // Step 6: Set up the remote
    await git.addRemote({ fs, dir, remote: "origin", url: remoteUrl });
    console.log(`Remote 'origin' set to: ${remoteUrl}`);

    // Step 7: Push the 'main' branch to the remote
    await git.push({
      fs,
      http,
      dir,
      remote: "origin",
      ref: "main",
      force: true,
      onAuth: () => ({ username: "oauth2", password: session.accessToken }),
      onProgress: (progress) => {
        console.log(
          `Progress: ${progress.phase} ${progress.loaded}/${progress.total}`
        );
      },
    });
    console.log("Pushed 'main' branch to remote.");

    // List all local branches
    const localBranches = await git.listBranches({ fs, dir: repoPath });

    // List all remote branches
    const remoteBranches = await git.listBranches({
      fs,
      dir: repoPath,
      remote: "origin",
    });

    const branches = [localBranches, remoteBranches];

    // Respond with success
    return res.status(200).json({
      message: "Repository initialized and pushed to remote successfully.",
      commitSha,
      branches: refactorBranch(branches as unknown as []),
    });
  } catch (error: any) {
    console.error("Error initializing repository:", error);
    return res.status(500).json({
      message: "Failed to initialize repository.",
      error: error.message,
    });
  }
}

function refactorBranch(branches: [] | null) {
  let refBranches:any = [];
  branches?.map((branch: string) => {
    return refBranches.push({ name: branch });
  });

  return refBranches;
}
