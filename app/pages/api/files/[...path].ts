import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

// Define an interface for the file structure
interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
  children?: FileItem[]; // Optional children for nested folders
}

// Recursive function to get the file structure
const getFiles = (dir: string): FileItem[] => {
  const files = fs.readdirSync(dir);
  return files.map((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const item: FileItem = {
      name: file,
      isDirectory,
      path: filePath,
      ...(isDirectory && { children: getFiles(filePath) }), // Recursively get children if it's a directory
    };
    return item;
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  const directoryPath = Array.isArray(filePath) ? path.join(process.cwd(), ...filePath) : process.cwd();

  try {
    const files = getFiles(directoryPath);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read directory' });
  }
}
