import { FileCopy, Folder, Refresh } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

function ToolBar() {
  return (
    <Box>
      <IconButton>
        <FileCopy sx={{ height: "20px", width: "20px" }} />
      </IconButton>
      <IconButton>
        <Folder sx={{ height: "20px", width: "20px" }} />
      </IconButton>
      <IconButton>
        <Refresh sx={{ height: "20px", width: "20px" }} />
      </IconButton>
    </Box>
  );
}

export default ToolBar;
