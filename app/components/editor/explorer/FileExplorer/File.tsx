import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import { FileItem, OpenFileItem } from "@/types/main";
import { FileCopy } from "@mui/icons-material";
import { Box, List, ListItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

const File = ({ file }: { file: FileItem }) => {
  const { openFiles, setOpenFiles } = useEditorLayoutContext();
  const { setActiveOpenFileIndex } = useExplorerContext();
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
    handleContextMenu,
  } = useFileBrowserContext();

  const openFile: OpenFileItem = {
    name: file.name,
    path: file.path,
    content: file.content,
    unSaved: false,
  };

  return (
    <ListItem
      onContextMenu={
        activeFilePath === file.path
          ? (e) => handleContextMenu(e, file.path)
          : (e) => {
              setFileType("File");
              setActiveFilePath(file.path);
              handleContextMenu(e, file.path);
            }
      }
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
        <Box
          key={file.name}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2px",
            p: 0,
            userSelect: "none",
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
            handleFile(file as unknown as OpenFileItem);

            // Assuming openFiles is already defined in the state
            function handleFile(file: OpenFileItem) {
              if (openFiles && openFiles.length > 0) {
                // Check if the file already exists in openFiles
                const fileExists = openFiles.some(
                  (_file) => _file.path === file.path
                );

                if (!fileExists) {
                  // If file does not exist, add it
                  setOpenFiles((prevFiles) => {
                    const updatedFiles = [...prevFiles!, openFile];
                    setActiveOpenFileIndex(updatedFiles.findIndex((of) => of.path === openFile.path));
                    return updatedFiles;
                  });                  
                } else {
                  // sets the selected file active cause its been opened prevly
                  setActiveOpenFileIndex(
                    openFiles.findIndex((of) => of.path === openFile.path)
                  );
                }
              } else {
                // If openFiles is empty, just add the file
                setOpenFiles((prevFiles) => [...prevFiles!, openFile]);
                setActiveOpenFileIndex(0);
              }
            }
          }}
        >
          <FileCopy sx={{ width: "10px", height: "10px" }} />
          <Typography variant="body2">{file.name}</Typography>
        </Box>
      )}
    </ListItem>
  );
};
export default File;
