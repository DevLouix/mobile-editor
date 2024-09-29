import { FileItem } from "@/types/main";
import { FileCopy } from "@mui/icons-material";
import { List, ListItem, Typography } from "@mui/material";
import React from "react";

const File = ({ file }: { file: FileItem }) => (
  <List>
    <ListItem
      key={file.name}
      sx={{ display: "flex", flexDirection: "row", gap: "2px", p: 0 }}
    >
      <FileCopy sx={{ width: "10px", height: "10px" }} />
      <Typography variant="body2">{file.name}</Typography>
    </ListItem>
  </List>
);

export default File;
