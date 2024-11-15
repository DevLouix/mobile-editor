// components/CodeBox.js
import { useState } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useExplorerContext } from '@/contexts/ExplorerContext';
import { Preview } from '@mui/icons-material';

const CodeBox = () => {
  const {fileContent,setFileContent}=useExplorerContext()
  const [code, setCode] = useState('');

  return (
    <Editor
      height="90vh"
      language={fileContent.language}
      value={fileContent.value}
      theme="vs-dark"
      path={fileContent.name}
      onChange={(newValue) => setFileContent(prevFileContent => ({
        ...prevFileContent,  // Keep all previous fields unchanged
        value: newValue,      // Update only the `value` field
      }))}
      
    />
  );
};

export default CodeBox;
