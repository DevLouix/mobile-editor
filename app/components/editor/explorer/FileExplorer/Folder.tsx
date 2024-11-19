import { FileItem } from "@/types/main";
import {
  ArrowDropDown,
  ArrowRight,
  FileCopy,
  FolderCopy,
} from "@mui/icons-material";
import { Box, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import File from "./File";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import ToolBar from "./ToolBar";

const Folder = ({
  files,
  parentFolderPath = "",
  activeFolderPath,
  setActiveFolderPath,
  newVal,
  setNewVal,
  handleCreateNew,
  rename,
  setRename,
}: {
  files: FileItem[];
  parentFolderPath?: string;
  newVal: string | null;
  setNewVal: React.Dispatch<React.SetStateAction<string | null>>;
  rename: boolean;
  setRename: React.Dispatch<React.SetStateAction<boolean>>;
  activeFolderPath: string | null;
  setActiveFolderPath: React.Dispatch<React.SetStateAction<string | null>>;
  handleCreateNew: () => {};
}) => {
  const [folderVisibility, setFolderVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const {
    rootDir,
    createNewFile,
    createNewFolder,
    setCreateNewFile,
    setCreateNewFolder,
  } = useExplorerContext();

  // Toggle visibility of subfolders
  const toggleSubFolder = (folderPath: string) => {
    setFolderVisibility((prevState) => ({
      ...prevState,
      [folderPath]: !prevState[folderPath],
    }));
  };

  // Handle folder click (set it as active folder)
  const handleFolderClick = (file: FileItem, path: string) => {
    setActiveFolderPath(path); // Set the folder path as active
    // console.log(file.path,activeFolderPath);
    
    setCreateNewFile(false);
    setCreateNewFolder(false);
    setNewVal(""); // Reset the "new directory" input value
    toggleSubFolder(path); // Toggle the visibility of the folder
  };

  return (
    <ul>
      {files.map((file, index) => {
        const fullPath = parentFolderPath
          ? `${parentFolderPath}/${file.name}`
          : file.name;

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
                          activeFolderPath === fullPath
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
                      <ToolBar />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "2px",
                        p: 0,
                        backgroundColor:
                          activeFolderPath === fullPath
                            ? "#f0f0f0"
                            : "transparent", // Highlight active folder
                        cursor: "pointer",
                      }}
                      onClick={() => handleFolderClick(file, fullPath)} // Set active folder on click
                    >
                      {folderVisibility[fullPath] ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowRight />
                      )}
                      {rename &&
                          activeFolderPath === fullPath ? (
                        <TextField
                          value={newVal}
                          onChange={(e) => {
                            setNewVal(e.currentTarget.value);
                          }}
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
                      activeFolderPath === fullPath ? (
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
                          parentFolderPath={fullPath} // Pass the full path to children
                          activeFolderPath={activeFolderPath} // Pass the active folder state
                          setActiveFolderPath={setActiveFolderPath} // Pass the setter function to children
                          newVal={newVal}
                          setNewVal={setNewVal}
                          rename={rename}
                          setRename={setRename}
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
