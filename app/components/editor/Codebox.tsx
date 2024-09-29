// components/CodeBox.js
import { useState } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

const CodeBox = () => {
  const [code, setCode] = useState('');

  return (
    <Editor
      height="90vh"
      language="javascript"
      value={code}
      theme="vs-dark"
      path='index.js'
      onChange={(newValue) => setCode(newValue as string)}
    />
  );
};

export default CodeBox;
