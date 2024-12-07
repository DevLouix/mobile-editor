import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useGitContext } from "@/contexts/Explorer/GitContext";

export default function Close() {
  const { rootDir, setRootDir } = useExplorerContext();
  const { sessionDir, sessionType, setEditorInUse } = useEditorLayoutContext();
  const {setBranch,setBranches}=useGitContext()

  function closeGitSession() {
    setRootDir(null);
    setEditorInUse(false);
    setBranch(null)
    setBranches(null)
  }

  async function handleCloseSession() {
    const res = await axios.post("api/explorer", {
      action: "clearDir",
      filePath: "/tmp/" + rootDir?.name,
    });
    console.log(res);

    switch (sessionType) {
      case "git":
        return closeGitSession();

      default:
        return;
    }
  }
  return (
    <Box width={"inherit"}>
      <Typography
        id="demo-positioned-button"
        variant="body2"
        fontWeight="bold"
        onClick={handleCloseSession}
        // onClick={handleClick}
        // onMouseLeave={handleClose}
      >
        Close Current Session
      </Typography>
    </Box>
  );
}
