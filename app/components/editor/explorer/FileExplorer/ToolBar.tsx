import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Add, FileCopy, Folder, Refresh } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

function ToolBar() {
  const {curExDir,setCreateNewFile,setCreateNewFolder}=useExplorerContext()
  return (
    <Box sx={{
      display:"flex",
      flexDirection:"row",
      gap:"2px"
    }}>
      <IconButton onClick={()=>{
        console.log(curExDir);
        setCreateNewFile(true)
      }}>
        <Add sx={{ height: "20px", width: "20px", color:'white' }} />
      </IconButton>
      <IconButton onClick={()=>{
        setCreateNewFolder(true)
      }}>
        <Folder sx={{ height: "20px", width: "20px" ,color:'white'}} />
      </IconButton>
      <IconButton>
        <Refresh sx={{ height: "20px", width: "20px" ,color:'white'}} />
      </IconButton>
    </Box>
  );
}

export default ToolBar;
