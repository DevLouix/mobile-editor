import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { List, ListItem } from "@mui/material";
import React, { useState } from "react";
import Folder from "./Folder";
import File from "./File";

const FileBrowser = () => {
  const { rootDir } = useExplorerContext();
  const [activeFolderPath, setActiveFolderPath] = useState<string | null>(null);


  if (!rootDir) return null;

  // Separate and sort directories and files
  const sortedDirectories = rootDir
    .filter((file) => file.isDirectory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedFiles = rootDir
    .filter((file) => !file.isDirectory)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Combine sorted directories and files
  const sortedItems = [...sortedDirectories, ...sortedFiles];

  return (
    <List>
      {sortedItems.map((file: FileItem, index: number) => (
        <ListItem key={index}>
          {file.isDirectory ? (
            <Folder files={[file] } activeFolderPath={activeFolderPath}  setActiveFolderPath={setActiveFolderPath}/>
          ) : (
            <File file={file} />
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default FileBrowser;
