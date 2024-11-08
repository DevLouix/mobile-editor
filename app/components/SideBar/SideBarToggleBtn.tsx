import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { ArrowRightAlt, ArrowLeftSharp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

function SideBarToggleBtn() {
  const { showSideBar, setShowSideBar, setEditorOnlyView } = useEditorLayoutContext();
  return (
    <IconButton
      onClick={() => {
        setShowSideBar(!showSideBar);
        setEditorOnlyView(true)
      }}
      sx={{
        position: "absolute",
        bottom: "100px",
        left: "5px",
        zIndex:9999,
        '&hover':{
          backgroundColor : "white"
        },
        backgroundColor: "grey",
      }}
    >
      {showSideBar ?   <ArrowLeftSharp />:<ArrowRightAlt />}
    </IconButton>
  );
}

export default SideBarToggleBtn;
