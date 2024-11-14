import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useEditorLayoutContext } from "./EditorLayoutContext";

// Define the shape of the context
interface DirItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface ExplorerContextType {
  files: DirItem[];
  setFiles: Dispatch<SetStateAction<DirItem[]>>;
  rootDir: DirItem[];
  setRootDir: Dispatch<SetStateAction<DirItem[]>>;
  fetchFiles: (dirPath?: string) => Promise<void>;
  createDirectory: (dirName: string) => Promise<void>;
}

// Create the context
const ExplorerContext = createContext<ExplorerContextType | undefined>(
  undefined
);

// Provider component
export const ExplorerContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { setEditorInUse, setShowRepoView } = useEditorLayoutContext();
  const [rootDir, setRootDir] = useState<DirItem[]>([]);
  const [files, setFiles] = useState<DirItem[]>([]);

  // Fetch files from the server
  const fetchFiles = async (dirPath?: string) => {
    const path = dirPath ? `?dir=${encodeURIComponent(dirPath)}` : "";
    const response = await fetch(`/api/files${path}`);
    if (response.ok) {
      const data = await response.json();
      setRootDir(data);
    } else {
      console.error("Failed to fetch files");
    }
  };

  // Create a new directory
  const createDirectory = async (dirName: string) => {
    const response = await fetch("/api/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dirName }),
    });

    if (response.ok) {
      await fetchFiles(); // Refresh the file list after creation
    } else {
      console.error("Failed to create directory");
    }
  };

  useEffect(() => {
    if (rootDir.length > 0) {
      setEditorInUse(true);
      setShowRepoView(false)
    } else {
      setEditorInUse(false);
      setShowRepoView(true)
    }
  }, [rootDir]);

  return (
    <ExplorerContext.Provider
      value={{
        rootDir,
        setRootDir,
        files,
        setFiles,
        fetchFiles,
        createDirectory,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

// Custom hook to use the ExplorerContext
export const useExplorerContext = (): ExplorerContextType => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error(
      "useExplorerContext must be used within an ExplorerContextProvider"
    );
  }
  return context;
};

export default ExplorerContextProvider;
