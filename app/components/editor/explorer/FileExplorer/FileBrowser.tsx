import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { Box, List, ListItem, Menu, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Folder from "./Folder";
import File from "./File";
import { FileCopy, FolderCopy } from "@mui/icons-material";
import axios from "axios";

const FileBrowser = () => {
  const {
    rootDir,
    setRootDir,
    rootFolder,
    createNewFile,
    createNewFolder,
    setCreateNewFile,
    setCreateNewFolder,
  } = useExplorerContext();
  const [activeFolderPath, setActiveFolderPath] = useState<string | null>(null);
  const [newVal, setNewVal] = useState<string | null>("");
  const [rename, setRename] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  if (!rootDir) return null;

  // Handle the "Create New" logic for folder/file creation
  const handleCreateNew = async () => {
    if (createNewFile) {
      await _createNewFile();
    } else if (createNewFolder) {
      await _createNewFolder();
    }
    setNewVal(""); // Reset input value after creation
  };

  // Create new folder logic (context-controlled)
  async function _createNewFolder() {
    console.log(newVal, activeFolderPath);

    const res = await axios.post("/api/explorer", {
      action: "createDir",
      filePath: `${activeFolderPath}/${newVal}`,
    });
    if (res.status == 200) {
      await refreshEx();
    }
    setActiveFolderPath(activeFolderPath + "/" + newVal);
    setNewVal(null);
    setCreateNewFolder(false);
  }

  // Create new file logic (context-controlled)
  async function _createNewFile() {
    console.log(newVal, activeFolderPath);

    const res = await axios.post("/api/explorer", {
      action: "createFile",
      filePath: `${activeFolderPath}/${newVal}`,
    });
    if (res.status == 200) {
      await refreshEx();
    }
    setActiveFolderPath(activeFolderPath);
    setNewVal(null);
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

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <div
      onContextMenu={(e) => {
        handleContextMenu(e);
      }}
      style={{ cursor: "context-menu" }}
    >
      {/* Context Menu */}
      <Menu
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
            console.log(rename);
            
            handleClose();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem onClick={handleClose}>Copy</MenuItem>
        <MenuItem onClick={handleClose}>Move</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      <List>
        {[rootDir]?.map((file: FileItem, index: number) => (
          <ListItem key={index}>
            {file.isDirectory ? (
              <Folder
                files={[file]}
                activeFolderPath={activeFolderPath}
                setActiveFolderPath={setActiveFolderPath}
                newVal={null}
                setNewVal={setNewVal}
                handleCreateNew={handleCreateNew}
                rename={rename}
                setRename={setRename}
              />
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
