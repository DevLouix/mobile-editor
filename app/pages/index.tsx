import CodeBox from "@/components/editor/Codebox";
import Explorer from "@/components/editor/explorer";
import OpenFiles from "@/components/editor/EditorToolbar/views/OpenFiles";
import NavBar from "@/components/SideBar/Index";
import { Box } from "@mui/material";
import { TreeItem } from "@nosferatu500/react-sortable-tree";
import React from "react";
import EditorToolbar from "@/components/editor/EditorToolbar/Index";

function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row"}}>
      <NavBar/>
      <div>
        <Explorer  />
      </div>
      <Box sx={{flexGrow:"1"}}>
        <EditorToolbar/>
        <CodeBox />
      </Box>
    </Box>
  );
}

export default Home;
