import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { FileItem } from "@/types/main"; // Adjust according to your project structure
import { it } from "node:test";

// Define base directory (adjust as needed for your environment)
const BASE_DIR = "/tmp";

// Helper to copy a file or directory recursively
const copyToFileSystem = (
  srcPath: string,
  destPath: string,
  isDirectory: boolean
) => {
  if (isDirectory) {
    fs.mkdirSync(destPath, { recursive: true });
    const items = fs.readdirSync(srcPath);
    items.forEach((item) => {
      const srcItemPath = path.join(srcPath, item);
      const destItemPath = path.join(destPath, item);
      const stat = fs.statSync(srcItemPath);
      if (stat.isDirectory()) {
        copyToFileSystem(srcItemPath, destItemPath, true);
      } else {
        fs.copyFileSync(srcItemPath, destItemPath);
      }
    });
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
};

// Main handler function for copying an item
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { itemPath, newParentPath } = req.body;

    let fullPath;
    if (itemPath?.startsWith("/tmp")) {
      fullPath = itemPath;
    } else {
      fullPath = path.join(BASE_DIR, itemPath);
    }

    try {
      // Ensure the item path and new parent path are valid
      const srcPath = fullPath; //path.join(BASE_DIR, itemPath);
      const destParentPath = itemPath.startsWith("/tmp")
        ? newParentPath
        : path.join(BASE_DIR, newParentPath);

      // Check if source item exists
      if (!fs.existsSync(srcPath)) {
        return res
          .status(404)
          .json({ message: `Source item at ${itemPath} does not exist.` });
      }

      // Check if the new parent directory exists
      if (!fs.existsSync(destParentPath)) {
        return res
          .status(404)
          .json({
            message: `Destination parent at ${newParentPath} does not exist.`,
          });
      }

      // Determine the destination path (for copying)
      const itemName = path.basename(srcPath);
      const destPath = path.join(destParentPath, itemName);

      // Ensure no item already exists at the destination
      if (fs.existsSync(destPath)) {
        return res
          .status(400)
          .json({
            message: `Item already exists at the destination path: ${destPath}.`,
          });
      }

      // Perform the file/directory copy
      const stat = fs.statSync(srcPath);
      copyToFileSystem(srcPath, destPath, stat.isDirectory());

      // Respond with the new path of the copied item
      return res.status(200).json({
        message: "Item copied successfully",
        newParentPath:  destParentPath ,//destPath,
        itemPath: fullPath,
      });
    } catch (error: any) {
      console.error("Error copying item:", error);
      return res
        .status(500)
        .json({ message: "Failed to copy item", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
