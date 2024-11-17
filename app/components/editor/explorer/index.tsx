import React from "react";
import GitExplorer from "./GitExplorer/Index";
import FileExplorer from "./FileExplorer";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Box } from "@mui/material";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";

function Explorer() {
  const {editorOnlyView}=useEditorLayoutContext()
  const {curExView}=useExplorerContext()
  function getView() {
    switch (curExView) {
      case "GitActions":
        return <GitExplorer/>
    
      default:
        return <FileExplorer/>
    }
  }
  return <Box sx={{
    minWidth: "40vw",
    maxWidth:"80vw",
    height: "100vh",
    overflow: "auto",
    backgroundColor: "black",
    color: "grey",
    overflowY: "auto",
    display: editorOnlyView ? "none" : "block",
  }} >{getView()}</Box>;
}

export default Explorer;
