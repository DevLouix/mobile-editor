import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";

export default function Close() {
  const { rootDir, setRootDir } = useExplorerContext();
  const { sessionDir, setEditorInUse } = useEditorLayoutContext();
  return (
    <Box width={"inherit"}>
      <Typography
        id="demo-positioned-button"
        variant="body2"
        fontWeight="bold"
        onClick={async () => {
          const res = await axios.post("api/explorer", {
            action: "clearDir",
            filePath: "/tmp/"+rootDir?.name,
          });
          console.log(res);
          setRootDir(null);
          setEditorInUse(false);
        }}
        // onClick={handleClick}
        // onMouseLeave={handleClose}
      >
        Close Current Session
      </Typography>
    </Box>
  );
}
