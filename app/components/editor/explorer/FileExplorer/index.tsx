import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ToolBar from "./ToolBar";
import { flexRowBetween } from "@/styles/main";
import FileBrowser from "./FileBrowser";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";

function FileExplorer() {
  const { editorOnlyView, setEditorOnlyView } = useEditorLayoutContext();
  const { rootDir, rootFolder } = useExplorerContext();

  return (
    <Box>
      <Typography variant="body2" p={1}>
        Explorer
      </Typography>
      <FileBrowser />
    </Box>
  );
}

export default FileExplorer;
