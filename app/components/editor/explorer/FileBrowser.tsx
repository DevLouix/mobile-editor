import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { ArrowRight, } from "@mui/icons-material";
import { List, ListItem } from "@mui/material";
import React from "react";
import Folder from "./Folder";
import File from "./File";

const FileBrowser = () => {
  const { rootDir } = useExplorerContext();

  return (
    <List>
      {rootDir?.map((file: FileItem,index) => (
        <>
          {file.isDirectory ? (
            <Folder key={index} files={[file]} />
          ) : (
            <File file={file}/>
          )}
        </>
      ))}
    </List>
  );
};

export default FileBrowser;
