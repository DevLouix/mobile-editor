import { FileItem, OpenFileItem } from "@/types/main";
import { Monaco } from "@monaco-editor/react";
import { Dispatch, SetStateAction } from "react";

// Function to find the FileItem by srcPath in the file system
const findFileItemByPath = (
  rootDir: FileItem,
  path: string
): FileItem | null => {
  if (rootDir.path === path) return rootDir;

  if (rootDir.isDirectory && rootDir.children) {
    for (const child of rootDir.children) {
      const found = findFileItemByPath(child, path);
      if (found) return found;
    }
  }
  return null;
};

// Create and add a Monaco model for a file
export function createMonacoModel(
  file: FileItem,monaco: Monaco,
  setModels: Dispatch<SetStateAction<Map<string, any>>>,
  setOpenFiles: Dispatch<SetStateAction<OpenFileItem[] | null>>,
  activeOpenFile: OpenFileItem
) {
  const content = file.content;
  const language = getFileLang(file.name);
  const filePath = file.path;
  // Chek if Monaco editor is available and initialized
  if (!monaco) {
    console.error("Monaco editor is not initialized");
    return;
  }

  // Check if the model already exists for this file path
  let model = monaco.editor.getModel(monaco.Uri.parse(filePath));

  // If the model does not exist, create a new one
  if (!model) {
    model = monaco.editor?.createModel(
      content!,
      language,
      monaco.Uri.parse(filePath)
    );
    setModels((prevModels) => new Map(prevModels).set(filePath, model)); // Add model to state
    // Attach the change listener
    model.onDidChangeContent(() => {
      //console.log(`Content edited in file: ${filePath}`);
      //console.log(openFiles);

      // Perform additional actions here (e.g., mark the file as edited)
      !activeOpenFile?.unSaved
        ? setOpenFiles((prevOpenFiles): any => {
            console.log("Previous Open Files:", prevOpenFiles);
            const updatedFiles = prevOpenFiles?.map((file) =>
              file.path === filePath ? { ...file, unSaved: true } : file
            );
            console.log("Updated Open Files:", updatedFiles);
            return updatedFiles;
          })
        : "";
    });
  }
}

// Function to copy Monaco model from srcPath to destPath
export const copyMonacoModel = (
  monaco: Monaco,
  rootDir: FileItem,
  srcPath: string,
  destPath: string,
  setModels: Dispatch<SetStateAction<Map<string, any>>>,
  setOpenFiles: Dispatch<SetStateAction<OpenFileItem[] | null>>,
  activeOpenFile: OpenFileItem
): void => {
  // Find the source FileItem from the srcPath
  const srcItem = findFileItemByPath(rootDir, srcPath);
  console.log(srcItem);
  if (!srcItem) {
    throw new Error(`File not found at path: ${srcPath}`);
  }

  // Get all Monaco models available
  const models = monaco.editor.getModels();
  let modelToCopy: any;
  // Find the Monaco model corresponding to srcPath
  if (!srcItem.isDirectory) {
    modelToCopy = models.find((model) => model.uri.path === srcPath);
    if (!modelToCopy) {
      createMonacoModel(srcItem,monaco,setModels,setOpenFiles,activeOpenFile)
    }


    let curPath = destPath + "/" + srcItem.name;
    // Create a new model at the destPath with the same content
    let model =monaco.editor.createModel(
      modelToCopy?.getValue(),
      modelToCopy?.getLanguageId(),
      monaco.Uri?.parse(curPath)
    );
    console.log(curPath,model.uri.path);

    setModels((prevModels) =>
      new Map(prevModels).set(model.uri.path, model)
    ); // Add model to state
    // Attach the change listener
    model?.onDidChangeContent(() => {
      //console.log(`Content edited in file: ${filePath}`);
      //console.log(openFiles);

      // Perform additional actions here (e.g., mark the file as edited)
      !activeOpenFile?.unSaved
        ? setOpenFiles((prevOpenFiles): any => {
            console.log("Previous Open Files:", prevOpenFiles);
            const updatedFiles = prevOpenFiles?.map((file) =>
              file.path === srcItem.path ? { ...file, unSaved: true } : file
            );
            console.log("Updated Open Files:", updatedFiles);
            return updatedFiles;
          })
        : "";
    });
    console.log(
      `Created new model for path: ${destPath} with content: ${modelToCopy?.getValue()}`
    );
  }
  // If it's a directory, recursively copy the models for its children
  else if (srcItem.isDirectory && srcItem.children) {
    srcItem.children.forEach((child) => {
      // For each child, recursively copy its Monaco model
      copyMonacoModel(
        monaco,
        rootDir,
        `${srcPath}/${child.name}`,
        `${destPath}/${child.name}`,
        setModels,
        setOpenFiles,
        activeOpenFile
      );
    });
  }
};

// Function to recursively update paths for moved FileItem and its children
const updatePathsForMovedItem = (
  item: FileItem,
  newParentPath: string,
  monaco: Monaco
): void => {
  const oldPath = item.path;
  const newPath = `${newParentPath}/${item.name}`;
  item.path = newPath;

  // Update the Monaco model for the new path
  const model = monaco.editor.getModels().find((m) => m.uri.path === oldPath);
  if (model) {
    monaco.editor.createModel(
      model.getValue(),
      model.getLanguageId(),
      monaco.Uri.parse(newPath)
    );
    model.dispose(); // Dispose of the old model
  }

  // Recursively update paths for children if it's a directory
  if (item.isDirectory && item.children) {
    item.children.forEach((child) => updatePathsForMovedItem(child, newPath, monaco));
  }
};

// Function to move a Monaco model
export const moveMonacoModel = (
  monaco: Monaco,
  rootDir: FileItem,
  srcPath: string,
  destDirPath: string
): void => {
  // Find the source item and destination directory
  const srcItem = findFileItemByPath(rootDir, srcPath);
  const destDir = findFileItemByPath(rootDir, destDirPath);

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
  const removeItemFromParent = (parent: FileItem, item: FileItem): void => {
    if (parent.children) {
      parent.children = parent.children.filter((child) => child !== item);
    }
  };
  // removeItemFromParent(rootDir, srcItem);

  // Update the paths for the moved item and its children
  updatePathsForMovedItem(srcItem, destDir.path, monaco);

  // Add the moved item to the destination directory
  destDir.children = [...(destDir.children || []), srcItem];

  console.log(`Moved item from ${srcPath} to ${destDirPath}`);
};

  // Determine the language of the file based on its extension
  export function getFileLang(name: string) {
    const extension = name?.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "scss",
      less: "less",
      java: "java",
      py: "python",
      rb: "ruby",
      php: "php",
      go: "go",
      c: "c",
      cpp: "cpp",
      rust: "rust",
      swift: "swift",
      kotlin: "kotlin",
      sql: "sql",
      md: "markdown",
      json: "json",
      yaml: "yaml",
      xml: "xml",
      txt: "plain text",
      csv: "csv",
      exe: "executable",
      pdf: "pdf",
      png: "png image",
      jpg: "jpg image",
      gif: "gif image",
      mp4: "mp4 video",
      mp3: "mp3 audio",
    };
    return extension ? languageMap[extension] || "unknown" : "unknown";
  }
