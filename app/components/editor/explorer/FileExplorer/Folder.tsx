import { FileItem } from "@/types/main";
import {
  ArrowDropDown,
  ArrowRight,
  FileCopy,
  FolderCopy,
  TextDecrease,
} from "@mui/icons-material";
import { Box, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import File from "./File";
import { useExplorerContext } from "@/contexts/ExplorerContext";

const Folder = ({ files }: { files: FileItem[] }) => {
  const [showSubFolder, setShowSubFolder] = useState(false);
  const {
    curExDir,
    setCurExDir,
    createNewFile,
    createNewFolder,
    setCreateNewFile,
    setCreateNewFolder,
  } = useExplorerContext();
  const [newDirVal, setNewDirVal] = useState("");

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
                    setCurExDir(file.path);
                  }}
                >
                  {file.name == files[index].name && showSubFolder ? (
                    <ArrowDropDown />
                  ) : (
                    <ArrowRight />
                  )}

                  <Typography variant="body2">{file.name}</Typography>
                </Box>

                {file.children &&
                showSubFolder &&
                file.name == files[index].name ? (
                  <Box p={1}>
                    {createNewFile ||
                    (createNewFolder && file.path == curExDir) ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "2px",
                          p: 0,
                        }}
                      >
                        {createNewFile ? (
                          <FileCopy sx={{ width: "10px", height: "10px" }} />
                        ) : (
                          <FolderCopy sx={{ width: "10px", height: "10px" }} />
                        )}
                        <TextField
                          //fullWidth
                          focused={true}
                          variant="outlined"
                          sx={{ input: { color: "white" } }}
                          value={newDirVal}
                          InputProps={{ style: { height: "20px" } }}
                          onChange={(e) => {
                            setNewDirVal(e.currentTarget.value);
                          }}
                          onBlur={() => {
                            createNewFile
                              ? setCreateNewFile(false)
                              : setCreateNewFolder(false);
                          }}
                        />
                      </Box>
                    ) : (
                      ""
                    )}
                    <Box>
                      {file.isDirectory ? (
                        <Folder files={file.children} />
                      ) : (
                        <File file={file} />
                      )}
                    </Box>
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
