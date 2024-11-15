import { FileItem } from "@/types/main";
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
  sessionType: string;
  setSessionType: Dispatch<SetStateAction<string>>;
  openFiles: FileItem[]|null;
  setOpenFiles: Dispatch<SetStateAction<FileItem[]|null>>;
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
  const [sessionType, setSessionType] = useState("");
  const [sessionDir, setSessionDir] = useState("");
  const [openFiles, setOpenFiles] = useState<Array<FileItem>|null>([]);
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
        sessionType,
        setSessionType,
        sessionDir,
        setSessionDir,
        openFiles,
        setOpenFiles,
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
