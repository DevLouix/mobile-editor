import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, MenuItem, Menu } from "@mui/material";
import React from "react";
import File from "./Items/File";
import Edit from "./Items/Edit";

function MenuButton() {
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
        <MenuItem >
          <File />
        </MenuItem>
        <MenuItem>
          <Edit />
        </MenuItem>
        <MenuItem onClick={handleClose}>Terminal</MenuItem>
      </Menu>
    </div>
  );
}

export default MenuButton;
