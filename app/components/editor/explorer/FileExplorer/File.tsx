import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import { FileItem } from "@/types/main";
import { FileCopy } from "@mui/icons-material";
import { List, ListItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

const File = ({ file }: { file: FileItem }) => {
  const { openFiles, setOpenFiles } = useEditorLayoutContext();
  const { setActiveFileIndex } = useExplorerContext();
  const {
    rename,
    setRename,
    setRenameVal,
    setFileType,
    activeFilePath,
    setActiveFilePath,
    handleRename,
    setCurrentFile,
    newVal,
    setNewVal,
  } = useFileBrowserContext();

  return (
    <ListItem
      sx={{ backgroundColor: activeFilePath == file.path ? "white" : "" }}
    >
      {rename && activeFilePath === file.path ? (
        <TextField
          //focused
          autoFocus
          value={newVal}
          variant="outlined"
          sx={{ input: { color: "black" } }}
          slotProps={{
            input: {
              style: { height: "20px", fontSize: "15px" },
            },
          }}
          onFocus={() => {
            setRenameVal(file.name);
            setNewVal(file.name);
            setRename(true);
          }}
          onChange={(e) => {
            setNewVal(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleRename();
            }
          }}
          onBlur={handleRename}
        />
      ) : (
        <ListItem
          key={file.name}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2px",
            p: 0,
          }}
          onClick={async () => {
            setFileType("File");
            setActiveFilePath(file.path);
            setCurrentFile(file);
            // console.log(file.path);

            // const res = await axios.post("api/explorer", {
            //   action: "read",
            //   filePath: file.path,
            // });
            // console.log(res);
            // file.content = res.data.content;
            handleFile(file);

            // Assuming openFiles is already defined in the state
            function handleFile(file: FileItem) {
              if (openFiles && openFiles.length > 0) {
                // Check if the file already exists in openFiles
                const fileExists = openFiles.some(
                  (_file) => _file.path === file.path
                );

                if (!fileExists) {
                  // If file does not exist, add it
                  setOpenFiles((prevFiles) => [...prevFiles!, file]);
                } else {
                  // sets the selected file active cause its been opened prevly
                  setActiveFileIndex(openFiles.indexOf(file));
                }
              } else {
                // If openFiles is empty, just add the file
                setOpenFiles((prevFiles) => [...prevFiles!, file]);
              }
            }
          }}
        >
          <FileCopy sx={{ width: "10px", height: "10px" }} />
          <Typography variant="body2">{file.name}</Typography>
        </ListItem>
      )}
    </ListItem>
  );
};
export default File;
