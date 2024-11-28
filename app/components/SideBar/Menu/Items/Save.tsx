import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { MenuItem, Typography } from "@mui/material";
import React from "react";

function Save() {
  const {
    hasUnSavedChange,
    setSaveType,
    unSavedChangeCount,
    setUnSavedChangeCount,
  } = useEditorLayoutContext();

  function handleSave() {
    setSaveType("Save");
  }

  function handleSaveAll() {
    setSaveType("SaveAll");
  }

  return (
    <div>
      {hasUnSavedChange ? (
        <>
          <MenuItem onClick={handleSave}>
            {" "}
            <Typography
              id="demo-positioned-button"
              variant="body2"
              fontWeight="bold"
            >
              Save
            </Typography>
          </MenuItem>
          {unSavedChangeCount > 1 ? (
            <MenuItem onClick={handleSaveAll}>
              <Typography
                id="demo-positioned-button"
                variant="body2"
                fontWeight="bold"
              >
                Save All
              </Typography>
            </MenuItem>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Save;
