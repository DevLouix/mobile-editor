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
import { buildVFSTree } from "@/lib/vfsBuild";
import { FileItem } from "@/types/main";
import axios from "axios";

// Define the shape of the context
interface DirItem {
  name: string;
  isDirectory: boolean;
  path: string;
}
interface RootFolder {
  name: string;
  path?: string;
}
interface FileContent {
  name: string;
  language: string;
  value: any;
}

interface ExplorerContextType {
  VFS: any[]; //THE MODIFIED RAW DATA FROM CLOUD IS STORED IN TRHIS VAR
  setVFS: Dispatch<SetStateAction<any[]>>;
  files: DirItem[];
  setFiles: Dispatch<SetStateAction<DirItem[]>>;
  activeFile: FileItem;
  setActiveFile: Dispatch<SetStateAction<FileItem>>;
  fileContent: FileContent;
  setFileContent: Dispatch<SetStateAction<FileContent>>;
  curExView: string;
  setCurExView: Dispatch<SetStateAction<string>>;
  curExDir: string;
  setCurExDir: Dispatch<SetStateAction<string>>;
  refreshFiles: boolean;
  setRefreshFiles: Dispatch<SetStateAction<boolean>>;
  createNewFolder: boolean;
  setCreateNewFolder: Dispatch<SetStateAction<boolean>>;
  createNewFile: boolean;
  setCreateNewFile: Dispatch<SetStateAction<boolean>>;
  activeFileIndex: number;
  setActiveFileIndex: Dispatch<SetStateAction<number>>;
  rootDir: FileItem | null; //THE RAW DATA FROM CLOUD IS STORED IN THIS VAR
  setRootDir: Dispatch<SetStateAction<FileItem | null>>;
  rootFolder: RootFolder | null; //THE RAW DATA FROM CLOUD IS STORED IN THIS VAR
  setRootFolder: Dispatch<SetStateAction<RootFolder | null>>;
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
  const [rootDir, setRootDir] = useState<FileItem | null>(null);
  const [rootDirInit, setRootDirInit] = useState(false);
  const [rootFolder, setRootFolder] = useState<RootFolder | null>(null);
  const [VFS, setVFS] = useState<any[]>([]);
  const [vfsTree, setVfsTree] = useState<any[]>([]);
  const [files, setFiles] = useState<DirItem[]>([]);
  const [fileContent, setFileContent] = useState<FileContent>(
    {} as unknown as FileContent
  );
  const [activeFile, setActiveFile] = useState<FileItem>(
    {} as unknown as FileItem
  );
  const [curExView, setCurExView] = useState("");
  const [curExDir, setCurExDir] = useState("");
  const [refreshFiles, setRefreshFiles] = useState(false);
  const [createNewFolder, setCreateNewFolder] = useState(false);
  const [createNewFile, setCreateNewFile] = useState(false);
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

  // Reads and popuilate files contents for monacoco model
  async function _vfsTree(rootDir: FileItem) {
    console.log(rootDir);

    const tree = await buildVFSTree([rootDir]);
    setVfsTree(tree);
  }

  useEffect(() => {
    // console.log(rootDir,"openFiles");

    if (rootDir) {
      if (!rootDirInit) {
        _vfsTree(rootDir);
        setEditorInUse(true);
        setShowRepoView(false);
        setRootDirInit(true);
      }
    } else {
      setOpenFiles([]);
      setEditorInUse(false);
      setShowRepoView(true);
      console.log("checking rerender");
    }
  }, [rootDir]);

  useEffect(() => {
    if (rootDir && vfsTree.length > 0) {
      setVFS(vfsTree as unknown as any);
      console.log(VFS, "vgs");
    }
  }, [VFS, vfsTree]);

  // toggle the selected file active in the ed
  useEffect(() => {
    //console.log(openFiles);
    setActiveFileIndex(openFiles?.length! - 1);
  }, [openFiles]);

  // sets file active
  useEffect(() => {
    const file = openFiles![activeFileIndex];
    setActiveFile(file);
  }, [activeFileIndex, activeFile, openFiles]);

  // async function refreshEx() {
  //   const res = await axios.post("/api/explorer", {
  //     action: "readDir",
  //     filePath: rootDir?.name,
  //   });
  //   console.log(res);
  //   // setRootDir(res.data.root);
  // }
  // useEffect(() => {
  //   if (refreshFiles) {
  //     refreshEx();
  //   }
  // }, [refreshFiles]);

  return (
    <ExplorerContext.Provider
      value={{
        rootDir,
        setRootDir,
        rootFolder,
        setRootFolder,
        refreshFiles,
        setRefreshFiles,
        curExView,
        setCurExView,
        curExDir,
        setCurExDir,
        createNewFile,
        setCreateNewFile,
        createNewFolder,
        setCreateNewFolder,
        files,
        setFiles,
        VFS,
        setVFS,
        activeFile,
        setActiveFile,
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
