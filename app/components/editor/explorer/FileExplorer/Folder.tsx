import { FileItem } from "@/types/main";
import {  ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import File from "./File";

const Folder = ({ files }: { files: FileItem[] }) => {
  const [showSubFolder, setShowSubFolder] = useState(false);

  return (
    <ul>
      {files.map((file, index) => (
        <List>
          <ListItem
            key={file.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {file.isDirectory ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                    p: 0,
                  }}
                  onClick={() => {
                    file.name == files[index].name
                      ? setShowSubFolder(!showSubFolder)
                      : "";
                      
                  }}
                >
                  {file.name == files[index].name && showSubFolder ? (
                    <ArrowDropDown />
                  ) : (
                    <ArrowRight />
                  )}

                  <Typography variant="body2">{file.name}</Typography>
                </Box>
                {file.children && showSubFolder && file.name == files[index].name? (
                  <Box p={1}>
                    <>
                      {file.isDirectory ? (
                        <Folder files={file.children} />
                      ) : (
                        <File file={file} />
                      )}
                    </>
                  </Box>
                ) : (
                  ""
                )}
              </>
            ) : (
              <File file={file} />
            )}
          </ListItem>
        </List>
      ))}
    </ul>
  );
};

export default Folder;
