import { useRef, useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { FileItem, OpenFileItem } from "@/types/main";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useFileBrowserContext } from "@/contexts/FileBrowserContext";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { Done } from "@mui/icons-material";
import { toastErrMini, toastSuccessMini } from "@/lib/toasts";
import { useModal } from "@/contexts/ModalContext";
import { getFileLang } from "@/lib/monaco";

const CodeBox = () => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null); // Ref to hold the editor instance
  const modelRef = useRef<any>(null); // Ref to hold the editor instance
  const {
    editorInUse,
    openFiles,
    setOpenFiles,
    saveType,
    setSaveType,
    models,
    setModels,
    setHasUnSavedChange,
    unSavedChangeCount,
    setUnSavedChangeCount,
  } = useEditorLayoutContext();
  const { fileType, currentFile } = useFileBrowserContext();
  const {
    VFS,
    activeOpenFile,
    setActiveOpenFileIndex,
    closeActiveOpenFileIndex,
    setCloseActiveOpenFileIndex,
  } = useExplorerContext();
  const { closeModal } = useModal();
  const [currentFilePath, setCurrentFilePath] = useState("");

  // Effect to create models when directory structure changes
  useEffect(() => {
    if (monaco) {
      createMonacoModelsFromDir(VFS);
    }
  }, [VFS, monaco]);

  useEffect(() => {
    switchFile(activeOpenFile?.path);
    console.log(activeOpenFile);
    
  }, [activeOpenFile]);

  // creates mofel for cur file
  useEffect(() => {
    if (fileType === "File" && currentFile) {
      // console.log(currentFile,"from monaco codebox");

      createMonacoModel(currentFile);
    }
  }, [currentFile]);

  //clear model on exit
  useEffect(() => {
    if (!editorInUse) {
      if (models.size > 0) {
        clearMonacoModels();
      }
    }
  }, [editorInUse]);

  // write to file on save
  useEffect(() => {
    if (saveType == "Save") {
      console.log("save");
      const modelContent = getModelContent(activeOpenFile.path);
      //console.log(modelContent);
      writeToFile(activeOpenFile.path, modelContent);

      // used if to prevent closing of openfile when menu save btn is used
      if (closeActiveOpenFileIndex != null) {
        setOpenFiles((prevItems) =>
          prevItems!.filter((_, _index) => _index !== closeActiveOpenFileIndex)
        );
        // setting the next openfile active
        //setActiveOpenFileIndex((prevIndex)=>prevIndex-1)
        setCloseActiveOpenFileIndex(null);
      }

      closeModal();
      setSaveType(null);
    } else if (saveType == "SaveAll") {
      console.log("saveall");
      openFiles?.map((file: OpenFileItem, index) => {
        if (file.unSaved) {
          writeToFile(
            file.path,
            getModelContent(file.path),
            openFiles.length == index+1
          );
        }
      });  
      closeModal();
      setSaveType(null);
    }
  }, [saveType]);

  async function writeToFile(
    filePath: string,
    content: any,
    notify: boolean = true
  ) {
    const res = await axios.post("/api/explorer", {
      action: "write",
      filePath: filePath,
      content: content,
    });
    console.log(res);
    if (res.status == 200) {
      setOpenFiles((prevOpenFiles): any => {
        const updatedFiles = prevOpenFiles?.map((file) =>
          file.path === filePath ? { ...file, unSaved: false } : file
        );
        return updatedFiles;
      });

      notify ? toastSuccessMini("") : "";
    } else {
      notify ? toastErrMini("") : "";
    }
  }
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
    // Chek if Monaco editor is available and initialized
    if (!monaco) {
      console.error("Monaco editor is not initialized");
      return;
    }

    // Check if the model already exists for this file path
    let model = monaco.editor.getModel(monaco.Uri.parse(filePath));

    // If the model does not exist, create a new one
    if (!model) {
      model = monaco.editor?.createModel(
        content!,
        language,
        monaco.Uri.parse(filePath)
      );
      setModels((prevModels) => new Map(prevModels).set(filePath, model)); // Add model to state
      // Attach the change listener
      model.onDidChangeContent(() => {
        //console.log(`Content edited in file: ${filePath}`);
        //console.log(openFiles);

        // Perform additional actions here (e.g., mark the file as edited)
        !activeOpenFile?.unSaved
          ? setOpenFiles((prevOpenFiles): any => {
              console.log("Previous Open Files:", prevOpenFiles);
              const updatedFiles = prevOpenFiles?.map((file) =>
                file.path === filePath ? { ...file, unSaved: true } : file
              );
              console.log("Updated Open Files:", updatedFiles);
              return updatedFiles;
            })
          : "";
      });
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
    modelRef.current = model;
    if (model && editorRef.current) {
      editorRef.current.setModel(model); // Switch to the new model
      setCurrentFilePath(filePath); // Update the current file path
    }
    console.log(filePath,model,"from switch");
    
  };

  function getModelContent(filePath: string) {
    const model = monaco?.editor.getModel(monaco.Uri.parse(filePath));

    if (model) {
      const content = model.getValue();
      console.log(`Content of file ${filePath}:`, content);
      return content;
    }
    return "";
  }

  function genNewFileComment(language: string) {
    const commentSyntax = {
      singleLine: {
        "//": [
          "javascript",
          "typescript",
          "java",
          "c",
          "cpp",
          "php",
          "go",
          "swift",
          "rust",
          "kotlin",
        ],
        "#": ["python", "ruby"],
      },
      multiLine: {
        "/* */": ["html", "css"],
      },
    };

    // Normalize the language to lowercase
    language = language.toLowerCase();

    // Check for the appropriate comment syntax
    for (const [syntax, languages] of Object.entries(
      commentSyntax.singleLine
    )) {
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


  useEffect(() => {
    if (editorRef.current && openFiles?.length==0) {
      editorRef.current.setModel(null)
    }
  }, [openFiles]);

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
