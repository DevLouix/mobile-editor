import { FileItem } from "@/types/main";
import {
  ArrowDropDown,
  ArrowRight,
  FileCopy,
  FolderCopy,
} from "@mui/icons-material";
import { Box, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import File from "./File";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import ToolBar from "./ToolBar";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import FileContextMenu from "./FileContextMenu";

const Folder = ({
  files,
  handleCreateNew,
}: {
  files: FileItem[];
  handleCreateNew: () => {};
}) => {
  const {
    activeFilePath,
    setActiveFilePath,
    newVal,
    setNewVal,
    rename,
    setRename,
    renameVal,
    setRenameVal,
    currentFile,
    setCurrentFile,
    setFileType,
    folderVisibility,
    toggleSubFolder,
    handleRename,
    handleContextMenu,
  } = useFileBrowserContext();

  const {
    rootDir,
    createNewFile,
    createNewFolder,
    setCreateNewFile,
    setCreateNewFolder,
  } = useExplorerContext();

  // Handle folder click (set it as active folder)
  const handleFolderClick = (file: FileItem, path: string) => {
    setFileType("Folder");
    setActiveFilePath(path); // Set the folder path as active
    setCurrentFile(file);
    // console.log(file.path,activeFilePath);

    setCreateNewFile(false);
    setCreateNewFolder(false);
    setNewVal(""); // Reset the "new directory" input value
    toggleSubFolder(path); // Toggle the visibility of the folder
  };

  return (
    <ul
      onContextMenu={(e) => {
        handleContextMenu(e);
      }}
      style={{ cursor: "context-menu" }}
    >
      {files.map((file, index) => {
        const fullPath = file.path;

        return (
          <List sx={{ p: 0 }} key={index}>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                p: 0,
              }}
            >
              {file.isDirectory ? (
                <>
                  <FileContextMenu file={file} />

                  {/* Check if its the root folder */}
                  {file.name == rootDir?.name ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "2px",
                        p: 0,
                        backgroundColor:
                          activeFilePath === fullPath
                            ? "#070707"
                            : "transparent", // Highlight active folder
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onClick={() => handleFolderClick(file, fullPath)} // Set active folder on click
                      >
                        {folderVisibility[fullPath] ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowRight />
                        )}
                        <Typography variant="body2">{file.name}</Typography>
                      </Box>
                      <ToolBar
                        folderActive={folderVisibility[activeFilePath!]}
                        toggleActive={() => {
                          toggleSubFolder(activeFilePath!);
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "2px",
                        p: 0,
                        backgroundColor:
                          activeFilePath === fullPath
                            ? "#f0f0f0"
                            : "transparent", // Highlight active folder
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleFolderClick(file, fullPath)} // Set active folder on click
                    >
                      {folderVisibility[fullPath] ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowRight />
                      )}
                      {rename && activeFilePath === fullPath ? (
                        <TextField
                          //focused
                          autoFocus
                          value={newVal}
                          variant="outlined"
                          sx={{ input: { color: "black" } }}
                          slotProps={{
                            input: {
                              style: { height: "20px", fontSize: "15px" },
                            },
                          }}
                          onFocus={() => {
                            setRenameVal(file.name);
                            setNewVal(file.name);
                            setRename(true);
                          }}
                          onChange={(e) => {
                            setNewVal(e.currentTarget.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key == "Enter") {
                              handleRename();
                            }
                          }}
                          onBlur={handleRename}
                        />
                      ) : (
                        <Typography variant="body1">{file.name}</Typography>
                      )}
                    </Box>
                  )}

                  {/* Show children if the folder is expanded */}
                  {file.children && folderVisibility[fullPath] ? (
                    <Box p={1}>
                      {/* Show the "Create New" input only for the active folder */}
                      {(createNewFile || createNewFolder) &&
                      activeFilePath === fullPath ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "2px",
                            p: 0,
                          }}
                        >
                          {createNewFile ? (
                            <FileCopy sx={{ width: "10px", height: "10px" }} />
                          ) : (
                            <FolderCopy
                              sx={{ width: "10px", height: "10px" }}
                            />
                          )}
                          <TextField
                            // focused
                            autoFocus
                            variant="outlined"
                            sx={{ input: { color: "white" } }}
                            value={newVal}
                            slotProps={{
                              input: {
                                style: { height: "20px", fontSize: "15px" },
                              },
                            }}
                            onChange={(e) => setNewVal(e.currentTarget.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCreateNew(); // Call function on Enter key press
                              }
                            }}
                            onBlur={handleCreateNew} // Trigger creation on blur
                          />
                        </Box>
                      ) : null}

                      {/* Recursively render children */}
                      <Box>
                        <Folder
                          files={file.children}
                          handleCreateNew={handleCreateNew}
                        />
                      </Box>
                    </Box>
                  ) : null}
                </>
              ) : (
                <File file={file} />
              )}
            </ListItem>
          </List>
        );
      })}
    </ul>
  );
};

export default Folder;
