import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { FileCopy } from "@mui/icons-material";
import { List, ListItem, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

const File = ({ file }: { file: FileItem }) => {
  const { openFiles, setOpenFiles } = useEditorLayoutContext();
  const {setActiveFileIndex}=useExplorerContext()

  return (
    <ListItem
      key={file.name}
      sx={{ display: "flex", flexDirection: "row", gap: "2px", p: 0 }}
      onClick={async () => {
        // console.log(file.path);

        // const res = await axios.post("api/explorer", {
        //   action: "read",
        //   filePath: file.path,
        // });
        // console.log(res);
        // file.content = res.data.content;
        handleFile(file)

        // Assuming openFiles is already defined in the state
        function handleFile  (file: FileItem) {
          if (openFiles && openFiles.length > 0) {
            // Check if the file already exists in openFiles
            const fileExists = openFiles.some(
              (_file) => _file.path === file.path
            );

            if (!fileExists) {
              // If file does not exist, add it
              setOpenFiles((prevFiles) => [...prevFiles!, file]);
            }else{
              // sets the selected file active cause its been opened prevly
              setActiveFileIndex(openFiles.indexOf(file))
            }
          } else {
            // If openFiles is empty, just add the file
            setOpenFiles((prevFiles) => [...prevFiles!, file]);
          }
        };
      }}
    >
      <FileCopy sx={{ width: "10px", height: "10px" }} />
      <Typography variant="body2">{file.name}</Typography>
    </ListItem>
  );
};
export default File;
