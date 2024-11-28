import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useModal } from "@/contexts/ModalContext";
import { flexRowBetween } from "@/styles/main";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

function SaveDialog({openFilesIndex}:{openFilesIndex:number}) {
  const { closeModal } = useModal();
  const { unSavedChangeCount, setSaveType } = useEditorLayoutContext();
  return (
    <div>
      <Typography variant="body1" fontWeight={"bold"}>
        You have unsaved changes!
      </Typography>
      <Box
        pt={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "grey" }}
          onClick={closeModal}
        >
          Cancel
        </Button>
        {unSavedChangeCount > 1 ? (
          <Button
            variant="contained"
            sx={{ backgroundColor: "lightblue" }}
            onClick={() => {
              setSaveType("SaveAll");
            }}
          >
            Save All
          </Button>
        ) : (
          ""
        )}
        <Button
          variant="contained"
          sx={{ backgroundColor: "blue" }}
          onClick={() => {
            setSaveType("Save");
          }}
        >
          Save
        </Button>
      </Box>
    </div>
  );
}

export default SaveDialog;
