import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import { useModal } from "@/contexts/ModalContext";
import { FileItem, OpenFileItem } from "@/types/main";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import SaveDialog from "../../../DialogContents/SaveDialog";

function OpenFiles() {
  const {
    openFiles,
    setOpenFiles,
    setHasUnSavedChange,
    setUnSavedChangeCount,
  } = useEditorLayoutContext();
  const { setActiveOpenFileIndex, activeOpenFileIndex, activeOpenFile ,setCloseActiveOpenFileIndex} =
    useExplorerContext();
  const { setActiveFilePath, activeFilePath } = useFileBrowserContext();
  const {openModal,closeModal,setContent}=useModal()

  function _hasUnsavedFiles(
    openFiles: { path: string; unSaved: boolean }[]
  ): boolean {
    return openFiles.some((file) => file.unSaved);
  }

  function getUnsavedFilesCount(
    openFiles: { path: string; unSaved: boolean }[]
  ): number {
    return openFiles.filter((file) => file.unSaved === true).length;
  }

  async function handleCloseOpenFile(index:number) {
    if (activeOpenFile?.unSaved) {
      setCloseActiveOpenFileIndex(index)
      openModal(<SaveDialog openFilesIndex={index}/>)
    }
    else{
      setOpenFiles((prevItems) =>
        prevItems!.filter((_, _index) => _index !== index)
      );
      if (openFiles?.length!>=1&&activeOpenFileIndex == 0) {
        setActiveOpenFileIndex(activeOpenFileIndex)
      }else{
        setActiveOpenFileIndex(activeOpenFileIndex-1)
      }
    }
    
  }

  // Example with dynamic check
  useEffect(() => {
    if (openFiles) {
      const unsaved = _hasUnsavedFiles(openFiles!);
      setHasUnSavedChange(unsaved);
      setUnSavedChangeCount(getUnsavedFilesCount(openFiles));
    }
  }, [openFiles]);

  useEffect(() => {
    activeFilePath != activeOpenFile?.path
      ? setActiveFilePath(activeOpenFile?.path)
      : "";
  },[activeOpenFile]);

  return (
    <Box sx={{ backgroundColor: "#333", width: "80vw", overflowX: "scroll" }}>
      <Box
        sx={{
          //minWidth: "max-content",
          display: "flex",
          flexDirection: "row",
          maxWidth: "100%",
          p: "0px 5px",
        }}
      >
        {openFiles?.map((file: OpenFileItem, index) => {
          return (
            <Box
              sx={{
                backgroundColor: activeOpenFileIndex == index ? "black" : "",
                display: "flex",
                flexDirection: "row",
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
                  setActiveOpenFileIndex(index);
                }}
              >
                {file.name}
              </Typography>
              {file.unSaved ? (
                <Box
                  sx={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: "orange",
                    borderRadius: "5px",
                  }}
                ></Box>
              ) : (
                ""
              )}
              <IconButton
                onClick={() => {
                  handleCloseOpenFile(index)
                }}
              >
                <Close
                  htmlColor={activeOpenFileIndex == index ? "white" : ""}
                />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default OpenFiles;
