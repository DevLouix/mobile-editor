import { FileItem, OpenFileItem } from "@/types/main";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

interface EditorLayoutContextType {
  editorOnlyView: boolean;
  setEditorOnlyView: Dispatch<SetStateAction<boolean>>;
  editorInUse: boolean;
  setEditorInUse: Dispatch<SetStateAction<boolean>>;
  models: Map<string, any>
  setModels: Dispatch<SetStateAction<Map<string, any>>>;
  sessionType: string;
  setSessionType: Dispatch<SetStateAction<string>>;
  editorToolbarView: number;
  setEditorToolbarView: Dispatch<SetStateAction<number>>;
  openFiles: OpenFileItem[]|null;
  setOpenFiles: Dispatch<SetStateAction<OpenFileItem[]|null>>;
  saveType: string|null;
  setSaveType: Dispatch<SetStateAction<string|null>>;
  unSavedFiles: FileItem[]|null;
  setUnSavedFiles: Dispatch<SetStateAction<FileItem[]|null>>;
  hasUnSavedChange: boolean;
  setHasUnSavedChange: Dispatch<SetStateAction<boolean>>;
  unSavedChangeCount: number;
  setUnSavedChangeCount: Dispatch<SetStateAction<number>>;
  sessionDir: string;
  setSessionDir: Dispatch<SetStateAction<string>>;
  showRepoView: boolean;
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  setShowRepoView: Dispatch<SetStateAction<boolean>>;
}

// Create the context
const EditorLayoutContext = createContext<EditorLayoutContextType | undefined>(
  undefined
);

// Provider component
export const EditorLayoutContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [editorOnlyView, setEditorOnlyView] = useState(false);
  const [editorInUse, setEditorInUse] = useState(false);
  const [models, setModels] = useState<Map<string, any>>(new Map());
  const [sessionType, setSessionType] = useState("");
  const [editorToolbarView, setEditorToolbarView] = useState(0);
  const [sessionDir, setSessionDir] = useState("");
  const [openFiles, setOpenFiles] = useState<Array<OpenFileItem>|null>([]);
  const [saveType, setSaveType] = useState<string|null>(null);
  const [unSavedFiles, setUnSavedFiles] = useState<Array<FileItem>|null>([]);
  const [hasUnSavedChange, setHasUnSavedChange] = useState(false);
  const [unSavedChangeCount, setUnSavedChangeCount] = useState<number>(0);
  const [showRepoView, setShowRepoView] = useState(false);
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
      console.log(sessionDir);
      
  }, [sessionDir]);

  return (
    <EditorLayoutContext.Provider
      value={{
        editorOnlyView,
        setEditorOnlyView,
        editorInUse,
        setEditorInUse,
        models,
        setModels,
        editorToolbarView,
        setEditorToolbarView,
        sessionType,
        setSessionType,
        sessionDir,
        setSessionDir,
        openFiles,
        setOpenFiles,
        saveType,
        setSaveType,
        unSavedFiles,
        setUnSavedFiles,
        hasUnSavedChange,
        setHasUnSavedChange,
        unSavedChangeCount,
        setUnSavedChangeCount,
        showSideBar,
        setShowSideBar,
        showRepoView,
        setShowRepoView,
      }}
    >
      {children}
    </EditorLayoutContext.Provider>
  );
};

// Custom hook to use the EditorLayoutContext
export const useEditorLayoutContext = (): EditorLayoutContextType => {
  const context = useContext(EditorLayoutContext);
  if (!context) {
    throw new Error(
      "useEditorLayoutContext must be used within an EditorLayoutContextProvider"
    );
  }
  return context;
};

export default EditorLayoutContextProvider;
