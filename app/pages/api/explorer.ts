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
      const fileContent = fs.readFileSync(filePath, "utf8");
      res.status(200).json({ content: fileContent });
    } else if (action === "write") {
      // Write new content to the file
      fs.writeFileSync(fullPath, content);
      res.status(200).json({ message: "File updated successfully" });
    } else if (action == "writeFiles" && Array.isArray(content)) {
      try {
        // Loop through each file and write the content to its respective file path
        content.forEach((file: { filePath: string; content: string }) => {
          const filePath = path.join(process.cwd(), file.filePath); // Absolute file path on the server
          
          // Create the parent directories if they don't exist
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // Write the file content to the disk
          fs.writeFileSync(filePath, file.content, 'utf8');
        });

        // Respond with success
        res.status(200).json({ message: 'Files saved successfully.' });
      } catch (error) {
        console.error('Error writing files:', error);
        res.status(500).json({ message: 'Failed to write files.', error });
      }
    } else if (action === "clearDir") {
      const clearDirectory = (dirPath: string) => {
        if (fs.existsSync(dirPath)) {
          // Read the contents of the directory
          const files = fs.readdirSync(dirPath);

          // Loop through each file/directory in the directory
          files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            // Check if it's a directory or file
            if (fs.statSync(filePath).isDirectory()) {
              // If it's a directory, recursively call clearDirectory
              clearDirectory(filePath);
            } else {
              // If it's a file, remove it
              fs.unlinkSync(filePath);
            }
          });

          // Finally, remove the now-empty directory
          fs.rmdirSync(dirPath);
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
    res.status(500).json({ error: error.message });
  }
}
