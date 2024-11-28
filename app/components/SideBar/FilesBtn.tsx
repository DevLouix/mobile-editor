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
        const isFiles = curExView === "";

        if (isFiles) {
          setEditorOnlyView(!editorOnlyView);
        } else {
          setCurExView("");
          if (editorOnlyView) {
            setEditorOnlyView(false);
          }
        }
      }}
    >
      <FileCopy />
    </IconButton>
  );
}

export default FilesBtn;
