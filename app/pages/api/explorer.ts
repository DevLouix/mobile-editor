import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const BASE_DIR = "/tmp"; // Replace with the path where the repo is cloned

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filePath, content, action, newName } = req.body;

  if (!filePath && action !== "clearDir") {
    res.status(400).json({ error: "File path is required" });
    return;
  }

  const fullPath = path.join(BASE_DIR, filePath || "");

  try {
    if (action === "read") {
      // Read file content
      const fileContent = fs.readFileSync(fullPath, "utf8");
      res.status(200).json({ content: fileContent });
    } else if (action === "write") {
      // Write new content to the file
      fs.writeFileSync(fullPath, content);
      res.status(200).json({ message: "File updated successfully" });
    } else if (action === "createFile") {
      // Create a new file
      await createFile(fullPath, content || "");
      res.status(200).json({ message: "File created successfully" });
    } else if (action === "createDir") {
      // Create a new directory
      await createDir(fullPath);
      res.status(200).json({ message: "Directory created successfully" });
    } else if (action === "writeFiles" && Array.isArray(content)) {
      try {
        // Write multiple files
        content.forEach((file: { filePath: string; content: string }) => {
          const fileFullPath = path.join(BASE_DIR, file.filePath);
          createFile(fileFullPath, file.content);
        });
        res.status(200).json({ message: "Files saved successfully." });
      } catch (error) {
        console.error("Error writing files:", error);
        res.status(500).json({ message: "Failed to write files.", error });
      }
    } else if (action == "readDir") {
      try {
        // Function to get the entire directory structure recursively
        const getDirectoryStructure = (dir: string): any[] => {
          const items = fs.readdirSync(dir).map((file) => {
            const filePath = path.join(dir, file);
            const isDirectory = fs.statSync(filePath).isDirectory();

            return {
              name: file,
              isDirectory,
              path: filePath.replace(BASE_DIR, ""), // Ensure paths are relative to BASE_DIR
              children: isDirectory ? getDirectoryStructure(filePath) : null, // Recursively add children if it's a directory
            };
          });

          // Sort directories and files
          return items.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1; // Directories first
            if (!a.isDirectory && b.isDirectory) return 1; // Files after directories
            return a.name.localeCompare(b.name); // Alphabetical order
          });
        };

        // Extract the root folder name from the provided directory path
        const rootNameMatch = fullPath.match(/\/([^/]+)$/); // Extract the last segment of the path
        const rootName = rootNameMatch ? rootNameMatch[1] : "Project";

        // Get the directory structure
        const dir = getDirectoryStructure(path.join(BASE_DIR, filePath));

        // Create a root folder object dynamically
        const rootFolder = {
          name: rootName,
          isDirectory: true,
          path: fullPath, // Relative path
          children: dir,
        };

        // Respond with the directory structure
        res.status(200).json(rootFolder);
      } catch (error: any) {
        console.error("Error generating directory structure:", error);

        res.status(500).json({ error: error.message });
      }
    } else if (action === "rename") {
      try {
        if (!newName) {
          res.status(400).json({ error: "New name is required for renaming." });
          return;
        }

        // Construct the new path with the new name
        const newPath = path.join(path.dirname(fullPath), newName);

        // Rename file or folder
        fs.renameSync(fullPath, newPath);

        res.status(200).json({
          message: `Renamed successfully to ${newName}`,
          oldPath: fullPath,
          newPath,
        });
      } catch (renameError: any) {
        console.error("Error during renaming:", renameError);
        res
          .status(500)
          .json({ error: `Failed to rename: ${renameError.message}` });
      }
    } else if (action === "delete") {
      try {
        if (!fs.existsSync(fullPath)) {
          res.status(404).json({ error: "File or folder does not exist." });
          return;
        }

        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          // Delete folder recursively
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          // Delete file
          fs.unlinkSync(fullPath);
        }

        res
          .status(200)
          .json({ message: "Deleted successfully.", path: fullPath });
      } catch (deleteError: any) {
        console.error("Error during deletion:", deleteError);
        res
          .status(500)
          .json({ error: `Failed to delete: ${deleteError?.message}` });
      }
    } else if (action === "clearDir") {
      const clearDirectory = (dirPath: string) => {
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
              clearDirectory(filePath);
            } else {
              fs.unlinkSync(filePath);
            }
          });
          fs.rmdirSync(dirPath);
        }
      };
      try {
        clearDirectory(filePath);
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

// Helper function to create a new file
async function createFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);

  // Ensure the parent directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create the file with the specified content
  fs.writeFileSync(filePath, content, "utf8");
}

// Helper function to create a new directory
async function createDir(dirPath: string) {
  // Create the directory recursively if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to recursively read and sort the directory structure
function getSortedDirectoryStructure(dir: string): any[] {
  const entries = fs.readdirSync(dir);

  const directories: any[] = [];
  const files: any[] = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      directories.push({
        name: entry,
        isDirectory: true,
        path: fullPath.replace(BASE_DIR, ""),
        children: getSortedDirectoryStructure(fullPath), // Recursively process children
      });
    } else {
      files.push({
        name: entry,
        isDirectory: false,
        path: fullPath.replace(BASE_DIR, ""),
      });
    }
  });

  // Sort directories and files alphabetically
  directories.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  // Combine sorted directories and files
  return [...directories, ...files];
}
