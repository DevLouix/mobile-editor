import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Add, FileCopy, Folder, Refresh } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

function ToolBar() {
  const {curExDir}=useExplorerContext()
  return (
    <Box sx={{
      display:"flex",
      flexDirection:"row",
      gap:"2px"
    }}>
      <IconButton>
        <Add sx={{ height: "20px", width: "20px", color:'white' }} />
      </IconButton>
      <IconButton>
        <Folder sx={{ height: "20px", width: "20px" ,color:'white'}} />
      </IconButton>
      <IconButton>
        <Refresh sx={{ height: "20px", width: "20px" ,color:'white'}} />
      </IconButton>
    </Box>
  );
}

export default ToolBar;
