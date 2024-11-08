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
  const [showRepoView, setShowRepoView] = useState(false);
  const [showSideBar, setShowSideBar] = useState(true);

  return (
    <EditorLayoutContext.Provider
      value={{ editorOnlyView, setEditorOnlyView, showSideBar, setShowSideBar,showRepoView, setShowRepoView  }}
    >
      {children}
    </EditorLayoutContext.Provider >
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
