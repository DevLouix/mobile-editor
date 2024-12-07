// context/FileBrowserContext.tsx
import Modal from "@/components/Modal";
import { copyItemToDir, moveItemToDir, renameDirItem } from "@/lib/editor";
import { FileItem } from "@/types/main";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";
import { useExplorerContext } from "./ExplorerContext";
import { useEditorLayoutContext } from "./EditorLayoutContext";
import { useMonaco } from "@monaco-editor/react";
import { copyMonacoModel, moveMonacoModel } from "@/lib/monaco";

interface FileBrowserContextType {
  rename: boolean;
  setRename: Dispatch<SetStateAction<boolean>>;
  pasteContext: boolean;
  setPasteContext: Dispatch<SetStateAction<boolean>>;
  copyPath: string | null;
  setCopyPath: Dispatch<SetStateAction<string | null>>;
  contextMenuPath: string | null;
  setContextMenuPath: Dispatch<SetStateAction<string | null>>;
  movePath: string | null;
  setMovePath: Dispatch<SetStateAction<string | null>>;
  movePastePath: string | null;
  setMovePastePath: Dispatch<SetStateAction<string | null>>;
  newVal: string | null;
  setNewVal: Dispatch<SetStateAction<string | null>>;
  fileActionType: string | null;
  setFileActionType: Dispatch<SetStateAction<string | null>>;
  renameVal: string | null;
  setRenameVal: Dispatch<SetStateAction<string | null>>;
  currentFile: FileItem | null;
  setCurrentFile: Dispatch<SetStateAction<FileItem | null>>;
  activeFilePath: string | null;
  setActiveFilePath: React.Dispatch<React.SetStateAction<string | null>>;
  fileType: string;
  setFileType: React.Dispatch<React.SetStateAction<string>>;
  folderVisibility: { [key: string]: boolean };
  setFolderVisibility: React.Dispatch<
    SetStateAction<{ [key: string]: boolean }>
  >;
  contextMenu: {
    mouseX: number;
    mouseY: number;
  } | null;
  setContextMenu: Dispatch<
    SetStateAction<{
      mouseX: number;
      mouseY: number;
    } | null>
  >;
  toggleSubFolder: (path: string) => void;
  handleRename: () => void;
  handleCopy: () => void;
  handleMove: () => void;
  handlePaste: () => void;
  handleContextMenu: (e: React.MouseEvent, path: string) => void;
}

const FileBrowserContext = createContext<FileBrowserContextType | undefined>(
  undefined
);

export const FileBrowserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [rename, setRename] = useState(false);
  const [pasteContext, setPasteContext] = useState(false);
  const [fileActionType, setFileActionType] = useState<string | null>(null);
  const [copyPath, setCopyPath] = useState<string | null>(null);
  const [contextMenuPath, setContextMenuPath] = useState<string | null>(null);
  const [movePath, setMovePath] = useState<string | null>(null);
  const [movePastePath, setMovePastePath] = useState<string | null>(null);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [newVal, setNewVal] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [renameVal, setRenameVal] = useState<string | null>(null);
  const [folderVisibility, setFolderVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [fileType, setFileType] = useState<string>("Folder");
  const monaco = useMonaco();
  const { models, setModels, setOpenFiles } = useEditorLayoutContext();
  const { rootDir, setRootDir, activeOpenFile } = useExplorerContext();

  // context menu
  const handleContextMenu = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    // setActiveFilePath(path)
    console.log(path);

    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null
    );
  };

  // Toggle visibility of subfolders
  const toggleSubFolder = (folderPath: string) => {
    setFolderVisibility((prevState) => ({
      ...prevState,
      [folderPath]: !prevState[folderPath],
    }));
  };

  async function handleRename() {
    // Only update the name if there's a change (to prevent unnecessary updates)
    if (newVal && newVal !== renameVal) {
      console.log("Renaming file/folder to:", newVal);
      // Here, you'd call your API or logic to update the name (e.g., rename the file/folder)
      const res = await axios.post("/api/explorer", {
        action: "rename",
        filePath: `${activeFilePath}`,
        newName: newVal,
      });
      console.log(res);

      if (res.status == 200) {
        const path = res.data.path;
        //console.log(rootDir, path);
        const newRootDir: FileItem = renameDirItem(
          rootDir!,
          activeFilePath!,
          newVal
        ) as unknown as FileItem;
        console.log(rootDir, newRootDir);
        setRootDir(newRootDir);
      }

      setRename(false); // Successfully renamed, so we can reset `rename` to false
      setActiveFilePath(`${activeFilePath?.replace(renameVal!, newVal)}`); // Update path after renaming
    } else {
      // If the name hasn't changed, just reset rename without making any changes
      setRename(false);
    }
  }

  async function handleCopy() {
    console.log("copy");
    const res = await axios.post("api/explorer/copy", {
      itemPath: copyPath,
      newParentPath: activeFilePath,
    });
    console.log(res);
    if (res.status == 200) {
      copyMonacoModel(
        monaco!,
        rootDir!,
        res.data.itemPath,
        res.data.newParentPath,
        setModels,
        setOpenFiles,
        activeOpenFile
      );
      setRootDir(
        copyItemToDir(rootDir!, res.data.itemPath, res.data.newParentPath)
      );
    }

    setCopyPath(null);
    setPasteContext(false);
  }

  async function handleMove() {
    console.log("move");
    const res = await axios.post("api/explorer/move", {
      itemPath: movePath,
      newParentPath: activeFilePath,
    });
    console.log(res);
    if (res.status == 200) {
      moveMonacoModel(monaco!, rootDir!, res.data.prevPath, res.data.newPath);
      setRootDir(moveItemToDir(rootDir!, res.data.prevPath, res.data.newPath));
    }
    setPasteContext(false);
  }

  async function handlePaste() {
    fileActionType == "Copy" ? handleCopy() : handleMove();
  }

  return (
    <FileBrowserContext.Provider
      value={{
        rename,
        setRename,
        pasteContext,
        setPasteContext,
        fileActionType,
        setFileActionType,
        renameVal,
        setRenameVal,
        copyPath,
        setCopyPath,
        contextMenuPath,
        setContextMenuPath,
        movePath,
        setMovePath,
        movePastePath,
        setMovePastePath,
        newVal,
        setNewVal,
        currentFile,
        setCurrentFile,
        fileType,
        setFileType,
        activeFilePath,
        setActiveFilePath,
        folderVisibility,
        setFolderVisibility,
        contextMenu,
        setContextMenu,
        handleContextMenu,
        toggleSubFolder,
        handleRename,
        handleCopy,
        handleMove,
        handlePaste,
      }}
    >
      {children}
    </FileBrowserContext.Provider>
  );
};

// Custom hook to use the modal context
export const useFileBrowserContext = () => {
  const context = useContext(FileBrowserContext);
  if (!context) {
    throw new Error(
      "useFileBroswerCtx must be used within a FileBrowserContetProvider"
    );
  }
  return context;
};
