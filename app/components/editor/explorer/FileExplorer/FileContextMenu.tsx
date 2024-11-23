import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import { removeDirFromRoot } from "@/lib/editor";
import { FileItem } from "@/types/main";
import { Menu, MenuItem } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

function FileContextMenu({file}:{file:FileItem}) {
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
    handlePaste,
    contextMenu,
    setContextMenu,
    handleContextMenu
  } = useFileBrowserContext();


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
    console.log(file);
    
    setContextMenu(null);
  };

  return (
    <div>
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
            console.log(rename, "fr filebrowser");

            handleClose();
          }}
        >
          Rename
        </MenuItem>
        {pasteContext ? (
          <MenuItem
            onClick={() => {
              handleClose();
              handlePaste();
            }}
          >
            Paste
          </MenuItem>
        ) : (
          ""
        )}
        <MenuItem
          onClick={async () => {
            setFileActionType("Copy");
            setPasteContext(true);
            handleClose();
          }}
        >
          Copy
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFileActionType("Move");
            setPasteContext(true);
            handleClose();
          }}
        >
          Move
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default FileContextMenu;