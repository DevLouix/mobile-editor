import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { Box, List, ListItem, Menu, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Folder from "./Folder";
import File from "./File";
import { FileCopy, FolderCopy } from "@mui/icons-material";
import axios from "axios";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import { addDirToRoot, addFileToDir, removeDirFromRoot } from "@/lib/editor";

const FileBrowser = () => {
  const {
    rootDir,
    setRootDir,
    createNewFile,
    createNewFolder,
    setCreateNewFile,
    setCreateNewFolder,
  } = useExplorerContext();
  const {
    activeFilePath,
    setActiveFilePath,
    newVal,
    setNewVal,
    rename,
    setRename,
    handleCopy,
    handleMove,
    fileType,
    setFileActionType,
    pasteContext,
    setPasteContext,
    handlePaste
  } = useFileBrowserContext();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  useEffect(() => {
    if (!activeFilePath && rootDir) {
      setActiveFilePath(rootDir?.path);
    }
    console.log(activeFilePath, "root filepath");
  }, [activeFilePath]);

  if (!rootDir) return null;

  // Handle the "Create New" logic for folder/file creation
  const handleCreateNew = async () => {
    if (createNewFile) {
      await _createNewFile();
    } else if (createNewFolder) {
      await _createNewFolder();
    }
    setNewVal(null); // Reset input value after creation
  };

  // Create new folder logic (context-controlled)
  async function _createNewFolder() {
    console.log(newVal, activeFilePath);

    if (newVal?.length! > 0) {
      const res = await axios.post("/api/explorer", {
        action: "createDir",
        filePath: `${activeFilePath}/${newVal}`,
      });
      if (res.status == 200) {
        const path = res.data.path;
        //console.log(rootDir, path);
        const newRootDir: FileItem = addDirToRoot(
          rootDir!,
          path,
          rootDir?.path!
        ) as unknown as FileItem;
        console.log(rootDir, newRootDir);
        setRootDir(newRootDir);
      }
      setActiveFilePath(activeFilePath + "/" + newVal);
      setNewVal(null);
    }
    setCreateNewFolder(false);
  }

  // Create new file logic (context-controlled)
  async function _createNewFile() {
    console.log(newVal, activeFilePath);

    if (newVal?.length! > 0) {
      const res = await axios.post("/api/explorer", {
        action: "createFile",
        filePath: `${activeFilePath}/${newVal}`,
      });
      if (res.status == 200) {
        setActiveFilePath(res.data.path);
        console.log(res);

        // setCreatNewModel
        setRootDir(addFileToDir(rootDir!, res.data.path!, rootDir?.path!));
      }
      setActiveFilePath(activeFilePath);
      setNewVal(null);
    }
    setCreateNewFile(false);
  }

  async function refreshEx() {
    const res = await axios.post("/api/explorer", {
      action: "readDir",
      filePath: rootDir?.name,
    });
    if (res.status == 200) {
      setRootDir(res.data);
    }
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
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

  async function handleDelete() {
    if (fileType == "File") {
      const res = await axios.post("/api/explorer", {
        action: "rmFile",
        filePath: activeFilePath,
      });
      const newRootDir = removeDirFromRoot(rootDir!, activeFilePath!);
      setRootDir(newRootDir);
      console.log(res);
    } else {
      const res = await axios.post("/api/explorer", {
        action: "clearDir",
        filePath: activeFilePath,
      });
      console.log(res);
      if (res.status == 200) {
        // const newRootDir = removeDirFromRoot(rootDir!,activeFilePath!)
      }
    }
    handleClose();
  }

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <div
      // onContextMenu={(e) => {
      //   handleContextMenu(e);
      // }}
      style={{ cursor: "context-menu" }}
    >
      {/* Context Menu */}
      {/* <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            setRename(true);
            console.log(rename, "fr filebrowser");

            handleClose();
          }}
        >
          Rename
        </MenuItem>
        {pasteContext?
        <MenuItem
          onClick={() => {
            handleClose();
            handlePaste();
          }}
        >
          Paste
        </MenuItem>:""}
        <MenuItem
          onClick={async () => {
            setFileActionType('Copy')
            setPasteContext(true)
            handleClose();
          }}
        >
          Copy
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFileActionType('Move')
            setPasteContext(true)
            handleClose();
          }}
        >
          Move
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu> */}
      <List>
        {[rootDir]?.map((file: FileItem, index: number) => (
          <ListItem key={index}>
            {file.isDirectory ? (
              <Folder files={[file]} handleCreateNew={handleCreateNew} />
            ) : (
              <File file={file} />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FileBrowser;
