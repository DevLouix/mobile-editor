import React, { useState } from 'react';

const LocalStorage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [directoryStructure, setDirectoryStructure] = useState([]);

  // Function to read a single file
  const handleFileSelect = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const content = await file.text();
      setSelectedFile(file.name);
      setFileContent(content);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  // Recursive function to read directory structure
  const getDirectoryStructure = async (dirHandle, path = '') => {
    const structure = [];
    for await (const entry of dirHandle.values()) {
      const entryPath = `${path}/${entry.name}`;
      if (entry.kind === 'file') {
        structure.push({ name: entry.name, path: entryPath, isDirectory: false });
      } else if (entry.kind === 'directory') {
        structure.push({
          name: entry.name,
          path: entryPath,
          isDirectory: true,
          children: await getDirectoryStructure(entry, entryPath),
        });
      }
    }
    return structure;
  };

  // Function to read the selected directory
  const handleDirectorySelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const structure = await getDirectoryStructure(dirHandle);
      setDirectoryStructure(structure);
      setSelectedFile(null);
      setFileContent('');
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  // Render directory structure
  const renderDirectory = (nodes) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.path}>
          {node.isDirectory ? (
            <>
              <strong>{node.name}</strong>
              {node.children && renderDirectory(node.children)}
            </>
          ) : (
            <span>{node.name}</span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2>File System Reader</h2>
      <button onClick={handleFileSelect}>Select File</button>
      <button onClick={handleDirectorySelect}>Select Folder</button>

      {selectedFile && (
        <div>
          <h3>Selected File: {selectedFile}</h3>
          <pre>{fileContent}</pre>
        </div>
      )}

      {directoryStructure.length > 0 && (
        <div>
          <h3>Directory Structure:</h3>
          {renderDirectory(directoryStructure)}
        </div>
      )}
    </div>
  );
};

export default LocalStorage;
