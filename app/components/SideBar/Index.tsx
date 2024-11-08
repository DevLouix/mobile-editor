import {
  ArrowLeft,
  ArrowLeftSharp,
  ArrowRightAlt,
  Menu,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import MenuButton from "./Menu/Index";
import FilesBtn from "./FilesBtn";
import SideBarToggleBtn from "./SideBarToggleBtn";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { RSC_ACTION_ENCRYPTION_ALIAS } from "next/dist/lib/constants";
import Repositories from "./Menu/Items/GitRepo/RepoView";

function SideBar() {
  const { showSideBar } = useEditorLayoutContext();
  return (
    <>
      {showSideBar ? (
        <Box
          component={"nav"}
          sx={{
            height: "100vh",
            backgroundColor: "grey",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuButton />
          <FilesBtn />
          
        </Box>
      ) : (
        ""
      )}
      <SideBarToggleBtn />
    </>
  );
}

export default SideBar;
