import * as git from 'isomorphic-git';
import fs from 'fs'; // Use fs.promises for async file operations
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { repoPath, branchName } = req.body; // Get repo path and branch name from request body

    try {
      // Ensure the repository path and branch name are provided
      if (!repoPath || !branchName) {
        return res.status(400).json({ error: 'Repository path and branch name are required' });
      }

      // Checkout the branch (this will create the branch if it doesn't exist locally)
      await git.branch({
        fs,
        dir: repoPath,
        ref: branchName,
        checkout: true,
        force: true,
      });

      // List all local branches
      const localBranches = await git.listBranches({ fs, dir: repoPath });

      // List all remote branches
      const remoteBranches = await git.listBranches({
        fs,
        dir: repoPath,
        remote: 'origin',
      });

      console.log('Local Branches:', localBranches);
      console.log('Remote Branches:', remoteBranches);

      return res.status(200).json({
        message: `Checked out to branch ${branchName} successfully`,
        branches: [...localBranches, ...remoteBranches],
      });
    } catch (error: any) {
      console.error('Error checking out branch:', error);
      return res.status(500).json({ error: 'Failed to checkout branch' });
    }
  } else {
    // Respond with 405 Method Not Allowed for non-POST requests
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
