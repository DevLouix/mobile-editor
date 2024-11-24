import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { FileItem } from '@/types/main'; // Adjust according to your project structure

// Define base directory (adjust as needed for your environment)
const BASE_DIR = '/tmp'; 

// Helper function to move an item on the filesystem (file or directory)
const moveToFileSystem = (srcPath: string, destPath: string, isDirectory: boolean) => {
  if (isDirectory) {
    fs.renameSync(srcPath, destPath); // Move directory
  } else {
    fs.renameSync(srcPath, destPath); // Move file
  }
};

// Main handler function for moving an item
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { itemPath, newParentPath } = req.body;

    try {
      // Construct full paths from the base directory
      const srcPath = itemPath //path.join(BASE_DIR, itemPath);
      const destParentPath = newParentPath //path.join(BASE_DIR, newParentPath);

      // Check if the source item exists
      if (!fs.existsSync(srcPath)) {
        return res.status(404).json({ message: `Source item at ${itemPath} does not exist.` });
      }

      // Check if the new parent directory exists
      if (!fs.existsSync(destParentPath)) {
        return res.status(404).json({ message: `Destination parent at ${newParentPath} does not exist.` });
      }

      // Ensure no item already exists at the destination
      const destPath = path.join(destParentPath, path.basename(srcPath));
      if (fs.existsSync(destPath)) {
        return res.status(400).json({ message: `Item already exists at the destination path: ${destPath}.` });
      }

      // Move the item in the filesystem (file or directory)
      const stat = fs.statSync(srcPath);
      moveToFileSystem(srcPath, destPath, stat.isDirectory());

      // Return success response with the new location
      return res.status(200).json({
        message: 'Item moved successfully',
        prevPath:itemPath,
        newPath: destPath,
      });
    } catch (error:any) {
      console.error('Error moving item:', error);
      return res.status(500).json({ message: 'Failed to move item', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
