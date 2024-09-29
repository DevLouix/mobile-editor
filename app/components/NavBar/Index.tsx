import { Menu } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import MenuButton from "./Menu/Index";

function NavBar() {
  return (
    <Box component={"nav"} sx={{ height: "100vh", backgroundColor: "grey",  padding:"5px"}}>
      <MenuButton/>
    </Box>
  );
}

export default NavBar;
