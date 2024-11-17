import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileCopy } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

function FilesBtn() {
  const { setEditorOnlyView, editorOnlyView } = useEditorLayoutContext();
  const { curExView, setCurExView } = useExplorerContext();
  return (
    <IconButton
      onClick={() => {
        setCurExView("");
        curExView == "" ? setEditorOnlyView(!editorOnlyView) : "";
      }}
    >
      <FileCopy />
    </IconButton>
  );
}

export default FilesBtn;
