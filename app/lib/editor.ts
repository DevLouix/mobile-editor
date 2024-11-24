import { FileItem } from "@/types/main";
import axios from "axios";
import path from "path";

interface MonacoModelContent {
  filePath: string;
  content: string;
}

// Recursive function to add a directory in the hierarchy

export const addDirToRoot = (
  rootDir: FileItem,
  dirPath: string,
  parentPath: string
): FileItem => {
  const segments = dirPath.replace(parentPath, "").split("/").filter(Boolean); // Split the path into segments
  const name = segments[0]; // Get the first segment (current directory name)

  console.log("Adding dir:", name, "to parentPath:", parentPath);

  // Build the current full path by combining parentPath and the current directory name
  const currentPath = `${parentPath}/${name}`;

  // If we are at the last segment in the path, we can create the directory
  if (segments.length === 1) {
    const existingDir = rootDir.children?.find((child) => child.name === name);
    if (!existingDir) {
      const newDir: FileItem = {
        name,
        isDirectory: true,
        path: currentPath,
        children: [],
      };
      rootDir.children = [...(rootDir.children || []), newDir]; // Add the new directory
    }
    return rootDir; // Return the updated rootDir
  } else {
    // We're not at the final segment yet, need to go deeper
    const currentDirName = name;
    let currentDir = rootDir.children?.find(
      (child) => child.name === currentDirName
    );

    // If the directory doesn't exist and we are inside the parentPath (not mistakenly adding directories under tmp/test-repo)
    if (!currentDir && currentPath.startsWith(parentPath)) {
      currentDir = {
        name: currentDirName,
        isDirectory: true,
        path: currentPath,
        children: [],
      };
      rootDir.children = [...(rootDir.children || []), currentDir]; // Add this directory to rootDir
    }

    // Now, recursively process the rest of the path (remaining segments)
    if (currentDir?.children) {
      currentDir.children = addDirToRoot(
        currentDir,
        segments.slice(1).join("/"),
        currentDir.path
      ).children!;
    }

    return rootDir; // Return the updated rootDir after recursion
  }
};

export const addFileToDir = (
  rootDir: FileItem,
  dirPath: string,
  parentPath: string
): FileItem => {
  const segments = dirPath.replace(parentPath, "").split("/").filter(Boolean); // Split the path into segments
  const name = segments[0]; // Get the first segment (current directory name)
  console.log(parentPath);

  console.log("Adding dir:", name, "to parentPath:", parentPath);

  // Build the current full path by combining parentPath and the current directory name
  const currentPath = `${parentPath}/${name}`;

  // If we are at the last segment in the path, we can create the directory
  if (segments.length === 1) {
    const existingFile = rootDir.children?.find((child) => child.name === name);
    if (!existingFile) {
      const newFile: FileItem = {
        name,
        isDirectory: false,
        path: currentPath,
        children: [],
        content: "",
      };
      rootDir.children = [...(rootDir.children || []), newFile]; // Add the new directory
    }
    return rootDir; // Return the updated rootDir
  } else {
    // We're not at the final segment yet, need to go deeper
    const currentDirName = name;
    let currentDir = rootDir.children?.find(
      (child) => child.name === currentDirName
    );

    // If the directory doesn't exist and we are inside the parentPath (not mistakenly adding directories under tmp/test-repo)
    if (!currentDir && currentPath.startsWith(parentPath)) {
      currentDir = {
        name: currentDirName,
        isDirectory: true,
        path: currentPath,
        children: [],
      };
      rootDir.children = [...(rootDir.children || []), currentDir]; // Add this directory to rootDir
    }

    // Now, recursively process the rest of the path (remaining segments)
    if (currentDir?.children) {
      currentDir.children = addFileToDir(
        currentDir,
        segments.slice(1).join("/"),
        currentDir.path
      ).children!;
    }

    return rootDir; // Return the updated rootDir after recursion
  }
};

export const renameDirItem = (
  rootDir: FileItem,
  oldPath: string,
  newName: string
): FileItem => {
  const item = findItemByPath(rootDir, oldPath);

  if (item) {
    const oldParentPath = item.path.substring(0, item.path.lastIndexOf("/"));
    const newPath = `${oldParentPath}/${newName}`;

    item.name = newName;
    item.path = newPath;
  }

  return rootDir;
}; 
export const copyItemToDir = (
  rootDir: FileItem,
  srcPath: string,
  destDirPath: string
): FileItem => {
  const srcItem = findItemByPath(rootDir, srcPath);
  const destDir = findItemByPath(rootDir, destDirPath);

  if (!srcItem) throw new Error(`Source item not found at path: ${srcPath}`);
  if (!destDir || !destDir.isDirectory)
    throw new Error(`Destination directory not found at path: ${destDirPath}`);

  // Check if an item with the same name already exists in the destination directory
  if (destDir.children?.some((child) => child.name === srcItem.name)) {
    throw new Error(
      `Item with name "${srcItem.name}" already exists in the destination directory.`
    );
  }

  // Deep clone the source item to avoid mutation
  const copiedItem = JSON.parse(JSON.stringify(srcItem));
  destDir.children = [...(destDir.children || []), copiedItem];

  return rootDir; // Return updated root directory structure
};

export const moveItemToDir = (
  rootDir: FileItem,
  srcPath: string,
  destDirPath: string
): FileItem => {
  const srcItem = findItemByPath(rootDir, srcPath);
  const destDir = findItemByPath(rootDir, destDirPath);

  if (!srcItem) throw new Error(`Source item not found at path: ${srcPath}`);
  if (!destDir || !destDir.isDirectory)
    throw new Error(`Destination directory not found at path: ${destDirPath}`);

  // Check if an item with the same name already exists in the destination directory
  if (destDir.children?.some((child) => child.name === srcItem.name)) {
    throw new Error(
      `Item with name "${srcItem.name}" already exists in the destination directory.`
    );
  }

  // Remove the source item from its parent
  removeItemFromParent(rootDir, srcItem);

  // Update the path of the moved item to reflect its new location
  srcItem.path = `${destDir.path}/${srcItem.name}`;
  destDir.children = [...(destDir.children || []), srcItem];

  return rootDir; // Return updated root directory structure
};

// Helper function to find or create a directory based on the segments provided
const findOrCreateDir = (
  rootDir: FileItem,
  destSegments: string[]
): FileItem => {
  let currentDir = rootDir;

  // Traverse or create directories based on the segments
  destSegments.forEach((segment) => {
    let nextDir = currentDir.children?.find((child) => child.name === segment);
    if (!nextDir) {
      nextDir = {
        name: segment,
        isDirectory: true,
        path: `${currentDir.path}/${segment}`,
        children: [],
      };
      currentDir.children = [...(currentDir.children || []), nextDir]; // Add new directory
    }
    currentDir = nextDir; // Move deeper into the directory structure
  });

  return currentDir;
};

// Helper function to remove item from its parent
const removeItemFromParent = (rootDir: FileItem, item: FileItem) => {
  const stack: FileItem[] = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current?.children) {
      const index = current.children.findIndex(
        (child) => child.path === item.path
      );
      if (index >= 0) {
        current.children.splice(index, 1);
        return;
      }
      current.children.forEach((child) => stack.push(child));
    }
  }
};

// Helper function to find item by its path
const findItemByPath = (
  rootDir: FileItem,
  path: string
): FileItem | undefined => {
  const stack: FileItem[] = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current?.path === path) {
      return current;
    }

    current?.children?.forEach((child) => stack.push(child));
  }
  return undefined;
};

export const removeDirFromRoot = (
  rootDir: FileItem,
  dirPath: string
): FileItem => {
  // Helper function to find and remove a directory
  const removeDir = (parentDir: FileItem, pathToRemove: string): boolean => {
    // Try to find the directory by matching the path
    const index = parentDir.children?.findIndex(
      (child) => child.path === pathToRemove
    );

    if (index !== undefined && index >= 0) {
      // Directory found, remove it from the parent
      parentDir.children?.splice(index, 1);
      return true; // Successfully removed
    }

    // Directory not found
    return false;
  };

  // Start by removing from the root
  if (removeDir(rootDir, dirPath)) {
    return rootDir; // Directory was found and removed
  }

  // If not found at root, recursively search through all children to remove
  const removeRecursively = (
    currentDir: FileItem,
    pathToRemove: string
  ): boolean => {
    if (currentDir.children) {
      for (let i = 0; i < currentDir.children.length; i++) {
        const child = currentDir.children[i];

        if (child.path === pathToRemove) {
          currentDir.children.splice(i, 1); // Remove the directory
          return true; // Successfully removed
        } else if (removeRecursively(child, pathToRemove)) {
          return true; // Found and removed in deeper level
        }
      }
    }
    return false; // Not found in this level
  };

  // Try to remove recursively if not found at root
  if (removeRecursively(rootDir, dirPath)) {
    return rootDir; // Directory was found and removed
  }

  // If directory is not found in the entire structure
  console.log("Directory not found:", dirPath);
  return rootDir; // Return the rootDir unchanged
};

export async function writeModelContentsToFile(monaco: any, apiUrl: string) {
  // Get all Monaco models (files) currently opened
  const models = monaco.editor.getModels();

  // Create an array to hold all the content of models
  const modelContents: MonacoModelContent[] = [];

  // Loop through each model and collect the file path and content
  models.forEach((model: any) => {
    modelContents.push({
      filePath: model.uri.path, // The file path (URI) of the Monaco model
      content: model.getValue(), // The content of the model
    });
  });

  console.log(models, "from write");

  try {
    // Send collected content to the server for writing to files
    const response = await axios.post(apiUrl, {
      action: "write", // Action type (write action)
      files: modelContents, // Array of model contents
    });

    if (response.status === 200) {
      console.log("Files saved successfully.");
    } else {
      console.error(
        "Failed to save files. Server responded with:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}
