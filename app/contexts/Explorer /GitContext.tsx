import { GitHubBranch, GitHubRepo } from "@/types/github";
import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useExplorerContext } from "../ExplorerContext";
import { useEditorLayoutContext } from "../EditorLayoutContext";

// Define the type for the GitContext state
interface GitContextType {
  repo: GitHubRepo | null;
  setRepo: Dispatch<SetStateAction<GitHubRepo | null>>;
  remote: string;
  setRemote: (remote: string) => void;
  branch: GitHubBranch | null;
  setBranch: Dispatch<SetStateAction<GitHubBranch | null>>;
  branches: GitHubBranch[] | null;
  setBranches: Dispatch<SetStateAction<GitHubBranch[] | null>>;
}

// Create the context
const GitContext = createContext<GitContextType | undefined>(undefined);

// Create the provider component
export const GitContextProvider = ({ children }: { children: ReactNode }) => {
  const { sessionType, editorInUse } = useEditorLayoutContext();
  const { rootDir } = useExplorerContext();
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [remote, setRemote] = useState<string>("origin");
  const [branch, setBranch] = useState<GitHubBranch | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[] | null>(null);

  return (
    <GitContext.Provider
      value={{
        repo,
        setRepo,
        remote,
        setRemote,
        branch,
        setBranch,
        branches,
        setBranches,
      }}
    >
      {children}
    </GitContext.Provider>
  );
};

// Custom hook for using the GitContext
export const useGitContext = (): GitContextType => {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error("useGitContext must be used within a GitContextProvider");
  }
  return context;
};
