import { useGitContext } from "@/contexts/Explorer/GitContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

function GitPush() {
  const { branch, repo } = useGitContext();
  const { rootDir } = useExplorerContext();
  // Handle Push Action (Placeholder)
  const handlePush = async () => {
    console.log("Pushing changes...");
    // Add logic to handle push action here
    const res = await axios.post("/api/github/push", {
      branch: branch?.name,
      repoPath: rootDir?.path,
      remote: repo?.html_url,
    });
    console.log(res);
  };

  return (
    <div>
      {/* Push Section */}
      <Typography variant="body2" gutterBottom>
        Push Changes
      </Typography>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handlePush}
      >
        Push
      </Button>
    </div>
  );
}

export default GitPush;
