import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export default function File() {
  const { setFiles } = useExplorerContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [fileStructure, setFileStructure] = useState<any[]>([]);

  // Function to load the directory structure into a JSON-like format
  const loadDirectoryStructure = async (
    directoryHandle: FileSystemDirectoryHandle,
    parentPath: string
  ): Promise<FileItem[]> => {
    const files: FileItem[] = [];

    // Separate arrays for directories and files
    const directories: FileItem[] = [];
    const regularFiles: FileItem[] = [];

    // Use for await...of to iterate through directory entries
    for await (const entry of directoryHandle.values()) {
      const fileInfo: FileItem = {
        name: entry.name,
        isDirectory: entry.kind === "directory",
        path: `${parentPath}/${entry.name}`, // Construct the full path
      };

      // Push to the appropriate array
      if (entry.kind === "directory") {
        directories.push(fileInfo); // Add to directories first
      } else {
        regularFiles.push(fileInfo); // Add to files
      }
    }

    // Concatenate directories and files, directories come first
    files.push(...directories, ...regularFiles);

    // Process the directories recursively to get their contents
    for (const dir of directories) {
      const dirHandle = await directoryHandle.getDirectoryHandle(dir.name); // Get directory handle
      dir.children = await loadDirectoryStructure(dirHandle, dir.path); // Recursive call
    }

    return files;
  };

  // Function to open a folder and get its structure
  const openFolderAndGetStructure = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker(); // Open the folder selector

      const folderStructure = await loadDirectoryStructure(
        directoryHandle,
        directoryHandle.name
      ); // Load the directory structure

      // Log the folder structure
      console.log(JSON.stringify(folderStructure, null, 2)); // Log the structure as JSON

      setFiles(folderStructure);
    } catch (error) {
      console.error("Failed to open directory:", (error as Error).message);
    }
  };

 
const ReadDir = async () => {
  await Filesystem.readdir({
    path: "",
    directory: Directory.Documents,
  });
};

  // openFilePicker();
  return (
    <div>
      <Typography
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        // onClick={handleClick}
        onMouseEnter={handleClick}
        // onMouseLeave={handleClose}
      >
        File
      </Typography>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>Open File</MenuItem>
        <MenuItem onClick={ReadDir}>Open Folder</MenuItem>
        <MenuItem onClick={handleClose}>Save</MenuItem>
      </Menu>
    </div>
  );
}
