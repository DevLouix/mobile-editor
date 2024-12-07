import { useGitContext } from "@/contexts/Explorer/GitContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { GitHubBranch } from "@/types/github";
import { BrandingWatermark, X } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";

function GitBranch() {
  const { rootDir } = useExplorerContext();
  const { repo, branch, setBranch,branches,setBranches } = useGitContext();
  const [defaultBranches, setDefaultBranches] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // For handling Menu (Branch Dropdown)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Branch Selection Handler
  const handleBranchChange = (event: SelectChangeEvent<string>) => {
    //setBranch(branch);
  };

  // Handle Branch Action (Placeholder)
  const handleBranchAction = () => {
    console.log("Selected Branch:", branch);
    // Add logic to handle branch action here
  };
  return (
    <Box sx={{ backgroundColor: "grey" }}>
      {/* Branch Section */}
      <Typography variant="body2" gutterBottom>
        Select Branch
      </Typography>
      
        <FormControl fullWidth margin="normal">
          <InputLabel>Branch</InputLabel>
          <Select
            value={branch?.name || "main"}
            onChange={(e) => {
              handleBranchChange(e);
            }}
            label="Branch"
            fullWidth
          >
            {branches?.map((branch: GitHubBranch, index) => {
              return (
                <MenuItem
                  key={index + branch.name}
                  value={branch.name}
                  onClick={() => setBranch(branch)}
                >
                  {branch.name}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>Select a branch to work with</FormHelperText>
        </FormControl>
      
      {/* <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleBranchAction}
      >
        Switch Branch
      </Button> */}
    </Box>
  );
}

export default GitBranch;
