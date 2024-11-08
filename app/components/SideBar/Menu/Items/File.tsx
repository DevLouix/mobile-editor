import React, { useState, useRef } from "react";
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface FileItem {
  name: string;
  type: string;
  size: number;
  path: string;
  children?: FileItem[];
}

export default function File() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const structure = buildFileStructure(files);
      console.log(JSON.stringify(structure, null, 2));
      setSelectedFile(structure[0].children ? structure[0].children[0] : null); // Select the first file
      setOpenFileDialog(true); // Open the dialog to confirm opening the file
    }
  };

  const buildFileStructure = (files: FileList): FileItem[] => {
    const fileMap: { [key: string]: FileItem } = {};

    for (const file of Array.from(files)) {
      const pathParts = file.webkitRelativePath.split('/');
      const fileName = pathParts.pop()!;
      const dirPath = pathParts.join('/');

      if (!fileMap[dirPath]) {
        fileMap[dirPath] = { name: dirPath, type: 'directory', size: 0, path: dirPath, children: [] };
      }

      const fileItem: FileItem = {
        name: fileName,
        type: file.type,
        size: file.size,
        path: `${dirPath}/${fileName}`,
      };

      fileMap[dirPath].children!.push(fileItem);
    }

    return Object.values(fileMap);
  };

  const openFileDialogHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDialogClose = () => {
    setOpenFileDialog(false);
  };

  const handleFileConfirmation = () => {
    if (selectedFile) {
      console.log(`Opening file: ${selectedFile.path}`);
      // Implement actual file opening logic here
    }
    handleDialogClose();
  };

  return (
    <div>
      <Typography variant="body2" fontWeight={"bold"}>New File</Typography>
    </div>
  );
}
