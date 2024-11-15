import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: any; // remember to make these attributes optional....
    webkitdirectory?: any;
  }
}

const LocalStorage = () => {
  const {setRootDir} = useExplorerContext()
  const {setSessionType,setSessionDir} = useEditorLayoutContext()
  const [fileList, setFileList] = useState([]);
  const openFile = useRef(null);

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
  };

  // Function to send files to Next.js API route
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/uploadFiles", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        console.log("Upload successful:", res);
        setRootDir(res.dir)
        setSessionType('local')
        setSessionDir(res.dirPath)
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(()=>{
    if (fileList.length>0) {
      handleUpload()
    }
  },[fileList])

  return (
    <div>
      <Typography
        variant="body2"
        fontWeight="bold"
        onClick={() => {
          openFile.current.click();
        }}
      >
        Open File
      </Typography>

      <input
        onChange={handleFileSelect}
        hidden
        directory
        webkitdirectory
        multiple
        type="file"
        ref={openFile}
      />

     </div>
  );
};

export default LocalStorage;
