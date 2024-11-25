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
import GitActions from "./GitActions/Index";

function SideBar() {
  const { showSideBar, editorInUse } = useEditorLayoutContext();
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
          {editorInUse ? (
            <>
              <FilesBtn />
              <GitActions />
            </>
          ) : (
            ""
          )}
        </Box>
      ) : (
        ""
      )}
      <SideBarToggleBtn />
    </>
  );
}

export default SideBar;
