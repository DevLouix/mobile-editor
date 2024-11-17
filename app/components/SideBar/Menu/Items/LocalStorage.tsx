import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

// Declare module to extend HTML attributes for custom props
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: boolean; // Optional attributes for directory upload
    webkitdirectory?: boolean;
  }
}

const LocalStorage: React.FC = () => {
  const { setRootDir } = useExplorerContext();
  const { setSessionType, setSessionDir } = useEditorLayoutContext();

  // Type the fileList as an array of File objects
  const [fileList, setFileList] = useState<File[]>([]);
  const openFile = useRef<HTMLInputElement | null>(null);

  // Function to handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFileList(files);
    }
  };

  // Function to send files to the API
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
        setRootDir(res.dir);
        setSessionType("local");
        setSessionDir(res.dirPath);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Trigger the upload whenever the fileList changes
  useEffect(() => {
    if (fileList.length > 0) {
      handleUpload();
    }
  }, [fileList]);

  return (
    <div>
      <Typography
        variant="body2"
        fontWeight="bold"
        onClick={() => {
          openFile.current?.click(); // Safe null check before calling click()
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
