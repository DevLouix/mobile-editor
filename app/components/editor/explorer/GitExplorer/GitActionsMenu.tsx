import React, { useState } from "react";
import { TextField, Button, Menu, MenuItem, FormControl, InputLabel, Select, FormHelperText, Typography, Divider, Box } from "@mui/material";

// GitActionsMenu Component
const GitActionsMenu = () => {
  // States for commit, branch, and git actions
  const [commitMessage, setCommitMessage] = useState("");
  const [branch, setBranch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // For handling Menu (Branch Dropdown)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Commit Message Handler
  const handleCommitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommitMessage(event.target.value);
  };

  // Branch Selection Handler
  const handleBranchChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBranch(event.target.value as string);
  };

  // Handle Commit Action (Placeholder)
  const handleCommit = () => {
    console.log("Commit message:", commitMessage);
    // Add logic to handle commit action here
  };

  // Handle Push Action (Placeholder)
  const handlePush = () => {
    console.log("Pushing changes...");
    // Add logic to handle push action here
  };

  // Handle Branch Action (Placeholder)
  const handleBranchAction = () => {
    console.log("Selected Branch:", branch);
    // Add logic to handle branch action here
  };

  return (
    <Box p={2} maxWidth={400} mx="auto">
      {/* Commit Section */}
      <Typography variant="body2" gutterBottom>
        Commit Changes
      </Typography>
      <TextField
        label="Commit Message"
        variant="outlined"
        fullWidth
        value={commitMessage}
        onChange={handleCommitChange}
        helperText="Enter your commit message"
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleCommit}>
        Commit
      </Button>

      <Divider sx={{ my: 2 }} />

      {/* Push Section */}
      <Typography variant="body2" gutterBottom>
        Push Changes
      </Typography>
      <Button variant="contained" color="success" fullWidth onClick={handlePush}>
        Push
      </Button>

      <Divider sx={{ my: 2 }} />

      {/* Branch Section */}
      <Typography variant="body2" gutterBottom>
        Select Branch
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Branch</InputLabel>
        <Select
          value={branch}
          onChange={handleBranchChange}
          label="Branch"
          fullWidth
        >
          <MenuItem value="main">main</MenuItem>
          <MenuItem value="dev">dev</MenuItem>
          <MenuItem value="feature-xyz">feature-xyz</MenuItem>
          <MenuItem value="bugfix-123">bugfix-123</MenuItem>
        </Select>
        <FormHelperText>Select a branch to work with</FormHelperText>
      </FormControl>
      <Button variant="contained" color="secondary" fullWidth onClick={handleBranchAction}>
        Switch Branch
      </Button>
    </Box>
  );
};

export default GitActionsMenu;
