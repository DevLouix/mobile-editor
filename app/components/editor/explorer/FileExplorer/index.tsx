import { Box, Typography } from "@mui/material";
import React from "react";
import ToolBar from "./ToolBar";
import { flexRowBetween } from "@/styles/main";
import FileBrowser from "./FileBrowser";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";

function FileExplorer() {
  const { editorOnlyView, setEditorOnlyView } = useEditorLayoutContext();
  return (
    
      <Box>
        <Box >
          <Typography variant="h6" fontWeight={"bold"}>
            Explorer
          </Typography>
          <ToolBar />
        </Box>
        <FileBrowser />
      </Box>
  
  );
}

export default FileExplorer;
