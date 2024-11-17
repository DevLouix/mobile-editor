import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Source, TrackChanges, Web } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

function GitActions() {
  const { setEditorOnlyView, editorOnlyView } = useEditorLayoutContext();
  const { curExView,setCurExView } = useExplorerContext();
  return (
    <div>
      <IconButton
        onClick={() => {
          curExView == "GitActions" ? setEditorOnlyView(!editorOnlyView) : "";
          setCurExView("GitActions");
        }}
      >
        <TrackChanges />
      </IconButton>
    </div>
  );
}

export default GitActions;
