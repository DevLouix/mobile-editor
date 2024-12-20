import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, MenuItem, Menu, Box } from "@mui/material";
import React from "react";
import File from "./Items/File";
import GitRepository from "./Items/GitRepo/Index";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import Close from "./Items/CloseSession";
import LocalStorage from "./Items/LocalStorage";
import Save from "./Items/Save";

function MenuButton() {
  const { editorInUse } = useEditorLayoutContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        onClick={(e) => {
          handleClick(e);
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {!editorInUse ? (
          <>
          <MenuItem><LocalStorage/></MenuItem>
          <MenuItem onClick={handleClose}>
            <GitRepository />
          </MenuItem>
         </>
        ) : (
          <>
            <Box><Save/></Box>
            <MenuItem onClick={handleClose}>
              <Close />
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}

export default MenuButton;
