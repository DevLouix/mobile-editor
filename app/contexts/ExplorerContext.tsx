import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useEditorLayoutContext } from "./EditorLayoutContext";
import { validate } from "uuid";
import { buildVFSTree }from "@/lib/vfsBuild";

// Define the shape of the context
interface DirItem {
  name: string;
  isDirectory: boolean;
  path: string;
}
interface FileContent {
  name: string;
  language: string;
  value: any;
}

interface ExplorerContextType {
  VFS: any[];
  setVFS: Dispatch<SetStateAction<any[]>>;
  files: DirItem[];
  setFiles: Dispatch<SetStateAction<DirItem[]>>;
  fileContent: FileContent;
  setFileContent: Dispatch<SetStateAction<FileContent>>;
  activeFileIndex: number;
  setActiveFileIndex: Dispatch<SetStateAction<number>>;
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
  const { setEditorInUse, setShowRepoView, setOpenFiles, openFiles } =
    useEditorLayoutContext();
  const [rootDir, setRootDir] = useState<DirItem[]>([]);
  const [VFS, setVFS] = useState<any[]>([]);
  const [vfsTree, setVfsTree] = useState<any[]>([]);
  const [files, setFiles] = useState<DirItem[]>([]);
  const [fileContent, setFileContent] = useState<FileContent>(
    {} as unknown as FileContent
  );
  const [activeFileIndex, setActiveFileIndex] = useState(0);

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

  async function _vfsTree(rootDir:any){
    const tree = await buildVFSTree(rootDir);
    setVfsTree(tree)
  }     

  useEffect(() => {
    //console.log('rootDir',openFiles);

    if (rootDir?.length > 0) {
      _vfsTree(rootDir)
      setEditorInUse(true);
      setShowRepoView(false);      
    } else 
    {
      setOpenFiles([]);
      setEditorInUse(false);
      setShowRepoView(true);
      console.log('checking rerender');
      
    }
  }, [rootDir]);

  useEffect(()=>{
     if(rootDir.length>0 && vfsTree.length>0){
      setVFS(vfsTree as unknown as any);      
      console.log(VFS,'vgs');
     }
  },[VFS,vfsTree])

  // toggle the selected file active in the ed
  useEffect(() => {
    //console.log(openFiles);
     setActiveFileIndex(openFiles?.length! - 1);
  }, [openFiles]);

  // reads and loads the content
  useEffect(() => {
    const file = openFiles![activeFileIndex];
    openFiles
      ? setFileContent({
          name: file?.name,
          value: file?.content,
          language: getFileLang(file?.name),
        })
      : "";
  }, [activeFileIndex, fileContent]);

  return (
    <ExplorerContext.Provider
      value={{
        rootDir,
        setRootDir,
        files,
        setFiles,
        VFS,
        setVFS,
        fileContent,
        setFileContent,
        activeFileIndex,
        setActiveFileIndex,
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
function getFileLang(name: string): string {
  // Extract the file extension from the name
  const extension = name?.split(".").pop()?.toLowerCase(); // Get extension, normalize to lowercase

  // Map file extensions to language names or file types
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    html: "html",
    css: "css",
    scss: "sass/scss",
    less: "less",
    java: "java",
    py: "python",
    rb: "ruby",
    php: "php",
    go: "go",
    c: "c",
    cpp: "c++",
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
    // Add more file extensions as needed...
  };

  // Return the corresponding language or file type in lowercase
  return extension ? languageMap[extension] || "unknown" : "unknown";
}
