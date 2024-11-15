import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";

function OpenFiles() {
  const { openFiles, setOpenFiles } = useEditorLayoutContext();
  const { setActiveFileIndex, activeFileIndex } = useExplorerContext();
  return (
    <Box sx={{ backgroundColor: "#333", width: "90vw", overflowX: "scroll" }}>
      <Box
        sx={{
          //minWidth: "max-content",
          display: "flex",
          flexDirection: "row",
          maxWidth: "100%",
          p: "0px 5px",
        }}
      >
        {openFiles?.map((file: FileItem, index) => {
          return (
            <Box
              sx={{
                backgroundColor: activeFileIndex == index ? "black" : "",
                display: "flex",
                fle8xDirection: "row",
                justifyClontent: "center",
                alignItems: "center",
                gap: "2px",
                color: "gray",
                p: "0px 2px",
              }}
            >
              <Typography
                variant="body2"
                onClick={() => {
                  setActiveFileIndex(index);
                }}
              >
                {file.name}
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenFiles((prevItems) =>
                    prevItems!.filter((_, _index) => _index !== index)
                  );
                }}
              >
                <Close htmlColor={activeFileIndex == index ? "white" : ""} />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default OpenFiles;
