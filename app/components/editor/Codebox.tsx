import { useRef, useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem } from "@/types/main";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";

const CodeBox = () => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null); // Ref to hold the editor instance
  const { editorInUse } = useEditorLayoutContext();
  const { fileType, currentFile } = useFileBrowserContext();
  const { VFS, activeFile } = useExplorerContext();
  const [models, setModels] = useState<Map<string, any>>(new Map());
  const [currentFilePath, setCurrentFilePath] = useState("");

  // Effect to create models when directory structure changes
  useEffect(() => {
    if (monaco) {
      createMonacoModelsFromDir(VFS);
    }
  }, [VFS, monaco]);

  useEffect(() => {
    switchFile(activeFile?.path);
  }, [activeFile]);

  useEffect(() => {
    if (fileType === "File" && currentFile) {
     // console.log(currentFile,"from monaco codebox");
      
      createMonacoModel(currentFile);
    }
  }, [currentFile]);

  useEffect(() => {
    if (!editorInUse) {
      if (models.size > 0) {
        clearMonacoModels();
      }
    }
  }, [editorInUse]);

  // Create Monaco models from the directory structure
  function createMonacoModelsFromDir(directoryStructure: FileItem[]) {
    directoryStructure.forEach((item) => {
      if (!item.isDirectory && item.content) {
        createMonacoModel(item); // Create a model for the file
      }

      if (item.isDirectory && item.children && item.children.length > 0) {
        createMonacoModelsFromDir(item.children); // Recursively process children
      }
    });
  }

  // Create and add a Monaco model for a file
  function createMonacoModel(file: FileItem) {
    const content = file.content;
    const language = getFileLang(file.name);
    const filePath = file.path;

    // Check if Monaco editor is available and initialized
    if (!monaco) {
      console.error("Monaco editor is not initialized");
      return;
    }

    // Check if the model already exists for this file path
    let model = monaco.editor.getModel(monaco.Uri.parse(filePath));

    // If the model does not exist, create a new one
    if (!model) {
      model = (monaco.editor?.createModel(
        content!,
        language,
        monaco.Uri.parse(filePath)
      ));
      setModels((prevModels) => new Map(prevModels).set(filePath, model)); // Add model to state
    }
  }

  // Function to clear all Monaco models
  function clearMonacoModels() {
    const models = monaco?.editor.getModels();

    models?.forEach((model) => {
      model.dispose();
    });

    console.log("All Monaco models have been cleared.");
  }

  function clearSpecificModel(fileName: string) {
    const models = monaco?.editor.getModels();

    models?.forEach((model) => {
      if (model.uri.path === fileName) {
        model.dispose();
        console.log(`Model for ${fileName} has been cleared.`);
      }
    });
  }

  // Switch file by updating the model in the editor
  const switchFile = (filePath: string) => {
    const model = models.get(filePath);
    if (model && editorRef.current) {
      editorRef.current.setModel(model); // Switch to the new model
      setCurrentFilePath(filePath); // Update the current file path
    }
  };

  function genNewFileComment(language:string) {
    const commentSyntax = {
        singleLine: {
            "//": ['javascript', 'typescript', 'java', 'c', 'cpp', 'php', 'go', 'swift', 'rust', 'kotlin'],
            "#": ['python', 'ruby']
        },
        multiLine: {
            "/* */": ['html', 'css']
        }
    };

    // Normalize the language to lowercase
    language = language.toLowerCase();

    // Check for the appropriate comment syntax
    for (const [syntax, languages] of Object.entries(commentSyntax.singleLine)) {
        if (languages.includes(language)) {
            return `${syntax} Start coding here...`;
        }
    }
    
    for (const [syntax, languages] of Object.entries(commentSyntax.multiLine)) {
        if (languages.includes(language)) {
            return `${syntax} Start coding here...`;
        }
    }

    return "// Comment syntax not available for this language";
}

  // Determine the language of the file based on its extension
  function getFileLang(name: string) {
    const extension = name?.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "scss",
      less: "less",
      java: "java",
      py: "python",
      rb: "ruby",
      php: "php",
      go: "go",
      c: "c",
      cpp: "cpp",
      rust: "rust",
      swift: "swift",
      kotlin: "kotlin",
      sql: "sql",
      md: "markdown",
      json: "json",
      yaml: "yaml",
      xml: "xml",
      txt: "plain text",
      csv: "csv",
      exe: "executable",
      pdf: "pdf",
      png: "png image",
      jpg: "jpg image",
      gif: "gif image",
      mp4: "mp4 video",
      mp3: "mp3 audio",
    };
    return extension ? languageMap[extension] || "unknown" : "unknown";
  }

  useEffect(() => {
    if (editorRef.current && models.size > 0) {
      const defaultFilePath = "/tmp/TermAid/ReadMe.md";
    }
  }, [models]);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  return (
    <div>
      <Editor
        height="90vh"
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeBox;
