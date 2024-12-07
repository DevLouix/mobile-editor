import React, { ReactNode, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography,
  Divider,
  Box,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import GitBranch from "./Menus/GitBranch";
import GitCommit from "./Menus/GitCommit";
import GitPush from "./Menus/GitPush";
import { useGitContext } from "@/contexts/Explorer/GitContext";
import GitInit from "./Menus/GitInit";
import axios from "axios";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";

// GitActionsMenu Component
const GitActionsMenu = () => {
  const {
    branchFetched,
    setBranchFetched,
    branch,
    branches,
    repo,
    setBranches,
    setBranch,
  } = useGitContext();
  const { sessionType } = useEditorLayoutContext();

  async function fetchBranches() {
    try {
      const res = await axios.get(repo?.branches_url.replace("{/branch}", "")!);
      console.log(res);

      if (res.status === 200) {
        setBranch(res.data[0]);
        setBranches(res.data);
        setBranchFetched(true);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }

  useEffect(() => {
    console.log(branches);
    if (sessionType === "git") {
      // Check if branches is empty
      if (branches == null) {
        console.log(branches);
        fetchBranches(); // Fetch branches if the array is empty
      }
    }
  }, [sessionType, branches]);

  return (
    <Box p={2} maxWidth={400} mx="auto">
      {branchFetched ? (
        <>
          {branch ? (
            <Box>
              <GitBranch />

              <Divider sx={{ my: 2 }} />

              <GitCommit />

              <Divider sx={{ my: 2 }} />
              <GitPush />
            </Box>
          ) : (
            <>
              <GitInit />
            </>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default GitActionsMenu;
