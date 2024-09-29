import CodeBox from "@/components/editor/Codebox";
import Explorer from "@/components/editor/explorer";
import OpenFiles from "@/components/editor/OpenFiles";
import NavBar from "@/components/NavBar/Index";
import { Box } from "@mui/material";
import { TreeItem } from "@nosferatu500/react-sortable-tree";
import React from "react";

function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row"}}>
      <NavBar/>
      <div>
        <Explorer  />
      </div>
      <Box sx={{flexGrow:"1"}}>
        <OpenFiles />
        <CodeBox />
      </Box>
    </Box>
  );
}

export default Home;
