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
      throw new Error(`Monaco model not found for path: ${srcPath}`);
    }
  }

  let curPath = destPath + "/" + srcItem.name;
  console.log(curPath);

  // Create a new model at the destPath with the same content
  monaco.editor.createModel(
    modelToCopy?.getValue(),
    modelToCopy?.getLanguageId(),
    monaco.Uri?.parse(curPath)
  );

  setModels((prevModels) => new Map(prevModels).set(srcItem.path, modelToCopy)); // Add model to state
  // Attach the change listener
  modelToCopy?.onDidChangeContent(() => {
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

  // If it's a directory, recursively copy the models for its children
  if (srcItem.isDirectory && srcItem.children) {
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
