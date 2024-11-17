import { FileItem } from "@/types/main";
import { ArrowDropDown, ArrowRight, FileCopy, FolderCopy } from "@mui/icons-material";
import { Box, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import File from "./File";
import { useExplorerContext } from "@/contexts/ExplorerContext";

const Folder = ({
  files,
  parentFolderPath = "",
  activeFolderPath,
  setActiveFolderPath,
}: {
  files: FileItem[];
  parentFolderPath?: string;
  activeFolderPath: string | null;
  setActiveFolderPath: React.Dispatch<React.SetStateAction<string | null>>; // Correctly typed setter function
}) => {
  const [newDirVal, setNewDirVal] = useState("");
  const [folderVisibility, setFolderVisibility] = useState<{ [key: string]: boolean }>({});
  const { createNewFile, createNewFolder, setCreateNewFile, setCreateNewFolder } = useExplorerContext();

  // Sort directories and files separately, alphabetically
  const sortedDirectories = files
    .filter((file) => file.isDirectory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedFiles = files
    .filter((file) => !file.isDirectory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedFilesWithDirectories = [...sortedDirectories, ...sortedFiles];

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
    setCreateNewFile(false);
    setCreateNewFolder(false);
    setNewDirVal(""); // Reset the "new directory" input value
    toggleSubFolder(path); // Toggle the visibility of the folder
  };

  // Handle the "Create New" logic for folder/file creation
  const handleCreateNew = async () => {
    if (createNewFile) {
      await _createNewFile();
    } else if (createNewFolder) {
      await _createNewFolder();
    }
    setNewDirVal(""); // Reset input value after creation
  };

  // Create new folder logic (context-controlled)
  async function _createNewFolder() {
    setCreateNewFolder(false);
  }

  // Create new file logic (context-controlled)
  async function _createNewFile() {
    setCreateNewFile(false);
  }

  return (
    <ul>
      {sortedFilesWithDirectories.map((file, index) => {
        const fullPath = parentFolderPath ? `${parentFolderPath}/${file.name}` : file.name;

        return (
          <List sx={{ p: 0 }} key={file.path}>
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "2px",
                      p: 0,
                      backgroundColor: activeFolderPath === fullPath ? "#f0f0f0" : "transparent", // Highlight active folder
                      cursor: "pointer",
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

                  {/* Show children if the folder is expanded */}
                  {file.children && folderVisibility[fullPath] ? (
                    <Box p={1}>
                      {/* Show the "Create New" input only for the active folder */}
                      {(createNewFile || createNewFolder) && activeFolderPath === fullPath ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "2px",
                            p: 0,
                          }}
                        >
                          {createNewFile ? (
                            <FileCopy sx={{ width: "10px", height: "10px" }} />
                          ) : (
                            <FolderCopy sx={{ width: "10px", height: "10px" }} />
                          )}
                          <TextField
                            focused
                            variant="outlined"
                            sx={{ input: { color: "white" } }}
                            value={newDirVal}
                            onChange={(e) => setNewDirVal(e.currentTarget.value)}
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
