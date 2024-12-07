import { FileItem } from "@/types/main";
import { ifError } from "assert";
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
  // Clone the rootDir to avoid unintended side effects
  const updatedRootDir = JSON.parse(JSON.stringify(rootDir));

  const item = findItemByPath(updatedRootDir, oldPath);

  if (item) {
    const oldParentPath = item.path.substring(0, item.path.lastIndexOf("/"));
    const newPath = `${oldParentPath}/${newName}`;

    // Update the folder's name and path
    item.name = newName;
    item.path = newPath;

    // Recursively update the paths of children if it's a folder
    if (item.children && item.children.length > 0) {
      updateChildrenPaths(item, oldPath, newPath);
    }
  }

  return updatedRootDir;
};

// Helper function to recursively update children paths
const updateChildrenPaths = (
  parent: FileItem,
  oldPath: string,
  newPath: string
) => {
  parent?.children?.forEach((child) => {
    // Update the path of the child
    child.path = child.path.replace(oldPath, newPath);

    // Recursively update paths if the child is a folder
    if (child.children && child.children.length > 0) {
      updateChildrenPaths(child, oldPath, newPath);
    }
  });
};

export const copyItemToDir = (
  rootDir: FileItem,
  srcPath: string,
  destDirPath: string
): FileItem => {
  console.log(srcPath,destDirPath);
  
  // Get the source item and destination directory using the getSrcItemToCopy function
  const srcItem = getSrcItemToCopy(rootDir, srcPath);
  const destDir = getSrcItemToCopy(rootDir, destDirPath);

  // Check if the source item and destination directory are found
  if (!srcItem) {
    throw new Error(`Source item not found at path: ${srcPath}`);
  }
  if (!destDir || !destDir.isDirectory) {
    throw new Error(`Destination directory not found at path: ${destDirPath}`);
  }

  // Check if an item with the same name already exists in the destination directory
  if (destDir.children?.some((child) => child.name === srcItem.name)) {
    throw new Error(
      `Item with name "${srcItem.name}" already exists in the destination directory.`
    );
  }

  // Create a copy of the source item
  const copiedItem = cloneItem(srcItem);

  // Update the path of the copied item to reflect its new location
  copiedItem.path = `${destDir.path}/${copiedItem.name}`;

  // If the item is a directory, recursively rename its children's paths
  const updatedItem = renameItemPathToMatchParent(destDir.path, copiedItem);

  // Add the copied item to the destination directory
  destDir.children = [...(destDir.children || []), updatedItem];

  return rootDir; // Return updated root directory structure
};

// Helper function to create a copy of the source item
function cloneItem(item: FileItem): FileItem {
  return {
    ...item,
    children: item.children ? item.children.map((child) => cloneItem(child)) : undefined,
  };
}

// Recursive path renaming function for the copied item and its children
function renameItemPathToMatchParent(parentPath: string, file: FileItem): FileItem {
  const updatedPath = `${parentPath}/${file.name}`;

  // Recursively process children if the file is a directory
  const updatedChildren = file.isDirectory && file.children
    ? file.children.map((child) => renameItemPathToMatchParent(updatedPath, child))
    : undefined;

  return {
    ...file,
    path: updatedPath,
    children: updatedChildren || [],
  };
}

// Helper function to get the item by its path
function getSrcItemToCopy(rootDir: FileItem, srcPath: string): FileItem | undefined {
  if (rootDir.path === srcPath) {
    return rootDir;
  }
  
  let foundItem;
  rootDir.children?.forEach((child) => {
    if (child.path === srcPath) {
      foundItem = child;
    }
  });
  return foundItem;
}

export const moveItemToDir = (
  rootDir: FileItem,
  srcPath: string,
  destDirPath: string
): FileItem => {  
  // Find source and destination items
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

  // Recursively update the path of the moved item and its children
  const updatedSrcItem = renameItemPathToMatchParent(destDirPath, srcItem);

  // Add the moved item to the destination directory
  destDir.children = [...(destDir.children || []), updatedSrcItem];

  return rootDir; // Return updated root directory structure
};

function findItemByPath(dir: FileItem, targetPath: string): FileItem | null {
  console.log(dir,targetPath,"finditempath");

  if (dir.path === targetPath) {
    return dir; // Base case: Found the target path
  }

  for (const child of dir.children || []) {
    const found = findItemByPath(child, targetPath); // Recursively search in children
    if (found) {
      return found; // Immediately return if found
    }
  }

  return null; // Return null if not found
}



// Helper function to remove the item from its parent directory
function removeItemFromParent(rootDir: FileItem, itemToRemove: FileItem): void {
  rootDir.children = (rootDir.children || []).filter(
    (child) => child?.path !== itemToRemove.path
  );

  // If the item is a directory, remove it recursively from all child directories
  rootDir.children?.forEach((child) => {
    if (child.isDirectory && child.children) {
      removeItemFromParent(child, itemToRemove);
    }
  });
}

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
