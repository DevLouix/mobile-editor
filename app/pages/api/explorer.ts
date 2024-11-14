import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const BASE_DIR = "/tmp"; // Replace with the path where repo is cloned

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filePath, content, action } = req.body;

  if (!filePath && action != "clearDir") {
    res.status(400).json({ error: "File path is required" });
    return;
  }

  const fullPath = path.join(BASE_DIR, filePath);

  try {
    if (action === "read") {
      // Read file content
      const fileContent = fs.readFileSync(fullPath, "utf8");
      res.status(200).json({ content: fileContent });
    } else if (action === "write") {
      // Write new content to the file
      fs.writeFileSync(fullPath, content);
      res.status(200).json({ message: "File updated successfully" });
    } else if (action === "clearDir") {
      const clearDirectory = (dirPath: string) => {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.statSync(currentPath).isDirectory()) {
              clearDirectory(currentPath); // Recursively clear subdirectories
              fs.rmdirSync(currentPath); // Remove the empty directory
            } else {
              fs.unlinkSync(currentPath); // Delete the file
            }
          });
        }
      };
      try {
        clearDirectory(filePath); // Clear the specified directory
        res.status(200).json({ message: "Directory cleared successfully" });
      } catch (error) {
        console.error("Error clearing directory:", error);
        res.status(500).json({ error: "Failed to clear directory" });
      }
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    res.status(500).json({ error:error.message });
  }
}
