import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Add, FileCopy, Folder, Refresh } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import axios from "axios";
import React from "react";

function ToolBar() {
  const {
    curExDir,
    setCreateNewFile,
    setCreateNewFolder,
    rootDir,
    setRootDir,
  } = useExplorerContext();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "2px",
      }}
    >
      <IconButton
        onClick={() => {
          console.log(curExDir);
          setCreateNewFolder(false);
          setCreateNewFile(true);
        }}
      >
        <Add sx={{ height: "20px", width: "20px", color: "white" }} />
      </IconButton>
      <IconButton
        onClick={() => {
          setCreateNewFile(false);
          setCreateNewFolder(true);
        }}
      >
        <Folder sx={{ height: "20px", width: "20px", color: "white" }} />
      </IconButton>
      <IconButton
        onClick={async () => {
          const res = await axios.post("/api/explorer", {
            action: "readDir",
            filePath: rootDir?.name,
          });
          if (res.status == 200) {
            setRootDir(res.data);
          }
          console.log(res);
        }}
      >
        <Refresh sx={{ height: "20px", width: "20px", color: "white" }} />
      </IconButton>
    </Box>
  );
}

export default ToolBar;
