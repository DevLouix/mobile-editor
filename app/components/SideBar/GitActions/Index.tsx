import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Source, TrackChanges, Web } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

function GitActions() {
  const { setEditorOnlyView, editorOnlyView } = useEditorLayoutContext();
  const { curExView, setCurExView } = useExplorerContext();
  return (
    <div>
      <IconButton
        onClick={() => {
          const isGitActions = curExView === "GitActions";
        
          if (isGitActions) {
            setEditorOnlyView(!editorOnlyView);
          } else {
            setCurExView("GitActions");
            if (editorOnlyView) {
              setEditorOnlyView(false);
            }
          }
        }}        
      >
        <TrackChanges />
      </IconButton>
    </div>
  );
}

export default GitActions;
