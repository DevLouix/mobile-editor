import React from "react";
import OpenFiles from "./views/OpenFiles";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import EditToolbarMenu from "./views/Edit/Index";
import BuildToolbarMenu from "./views/Build/Index";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

function EditorToolbar() {
  const { editorToolbarView,openFiles, setEditorToolbarView, editorInUse } =
    useEditorLayoutContext();
  function getView() {
    switch (editorToolbarView) {
      case 0:
        return <OpenFiles />;

      case 1:
        return <EditToolbarMenu />;

      case 2:
        return <BuildToolbarMenu />;

      default:
        return <OpenFiles />;
    }
  }

  function toggleToolbarView() {
    editorToolbarView >= 2
      ? setEditorToolbarView(0)
      : setEditorToolbarView(editorToolbarView + 1);
  }
  return (
    <div>
      {editorInUse && openFiles?.length? (
        <Box>
          <Box width={"100%"}sx={{ backgroundColor: "#333"}}>{getView()}</Box>
          <IconButton
            sx={{
              backgroundColor: "grey",
              position: "absolute",
              borderRadius:0,
              top: 0,
              right: 0,
              width: '10vw',
              zIndex: "9999",
              ":hover": {
                backgroundColor: "darkgray",
              },
            }}
            onClick={toggleToolbarView}
          >
            <ChevronLeft htmlColor="black" />
          </IconButton>
        </Box>
      ) : (
        ""
      )}
    </div>
  );
}

export default EditorToolbar;
