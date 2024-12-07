import { useGitContext } from "@/contexts/Explorer/GitContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function GitCommit() {
    const {rootDir}=useExplorerContext()
    const session = useSession()
    const [gitUser,setGitUser]=useState<any>({})

    useEffect(()=>{
        session?setGitUser(session.data?.user):""
    },[])
  // States for commit, branch, and git actions
  const [commitMessage, setCommitMessage] = useState("");

  // Commit Message Handler
  const handleCommitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommitMessage(event.target.value);
  };
  // Handle Commit Action (Placeholder)
  const handleCommit = async () => {
    console.log("Commit message:", commitMessage,session);
    // Add logic to handle commit action here
    const res = await axios.post("api/github/commit",{dir:rootDir?.path,author:{name: gitUser.name,email:gitUser.email},message:commitMessage})
    console.log(res);
    
  };
  return (
    <div >
      {" "}
      {/* Commit Section */}
      <Typography variant="body2" color="grey" gutterBottom>
        Commit Changes
      </Typography>
      <Box  sx={{backgroundColor:"white"}}><TextField
        label="Commit Message"
        variant="outlined"
        fullWidth
        value={commitMessage}
        onChange={handleCommitChange}
        helperText="Enter your commit message"
        margin="normal"
      /></Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCommit}
      >
        Commit
      </Button>
    </div>
  );
}

export default GitCommit;
