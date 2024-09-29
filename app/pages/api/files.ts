import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

// Define an interface for file items
interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

// Function to get files in a directory
const getFiles = (dir: string): FileItem[] => {
  return fs.readdirSync(dir).map((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    return {
      name: file,
      isDirectory,
      path: filePath,
    };
  });
};

// Define the base directory for your files
const baseDir = path.join(process.cwd(), 'files');

// Ensure the base directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// API handler for file operations
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { dir } = req.query; // Get the directory from the query
  const directoryPath = dir ? path.join(baseDir, dir as string) : baseDir;

  switch (method) {
    case 'GET':
      // List files in the specified or base directory
      try {
        const files = getFiles(directoryPath);
        res.status(200).json(files);
      } catch (error) {
        res.status(500).json({ error: 'Failed to read directory' });
      }
      break;

    case 'POST':
      const { dirName } = req.body; // Get the directory name from the request body

      if (dirName) {
        const newDirPath = path.join(directoryPath, dirName);
        if (!fs.existsSync(newDirPath)) {
          fs.mkdirSync(newDirPath);
          res.status(201).json({ message: 'Directory created', path: newDirPath });
        } else {
          res.status(400).json({ error: 'Directory already exists' });
        }
      } else {
        res.status(400).json({ error: 'Directory name is required' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
