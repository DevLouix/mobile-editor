import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileCopy } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

function FilesBtn() {
  const { setEditorOnlyView, editorOnlyView } = useEditorLayoutContext();
  return (
    <IconButton
      onClick={() => {
        setEditorOnlyView(!editorOnlyView);
      }}
    >
      <FileCopy />
    </IconButton>
  );
}

export default FilesBtn;
