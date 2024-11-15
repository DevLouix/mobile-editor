// components/CodeBox.js
import { useState } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useExplorerContext } from '@/contexts/ExplorerContext';

const CodeBox = () => {
  const {fileContent,setFileContent}=useExplorerContext()
  const [code, setCode] = useState('');

  return (
    <Editor
      height="90vh"
      language="javascript"
      value={fileContent}
      theme="vs-dark"
      path='index.js'
      onChange={(newValue) => setFileContent(newValue as string)}
    />
  );
};

export default CodeBox;
