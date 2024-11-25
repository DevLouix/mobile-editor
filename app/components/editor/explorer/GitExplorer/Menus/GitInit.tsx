import { useGitContext } from "@/contexts/Explorer /GitContext";
import { useExplorerContext } from "@/contexts/ExplorerContext";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function GitInit() {
  const { rootDir } = useExplorerContext();
  const { repo, setInitializedEmptyGit, setBranch, setBranches } = useGitContext();
  const session = useSession();
  const user = session.data?.user;
  const [initializing, setInitializing] = useState(false);

  return (
    <div
      onClick={async () => {
        setInitializing(true);
        const res = await axios.post("api/github/initialize", {
          repoPath: rootDir?.path,
          commitMessage: "initial",
          authorName: user?.name,
          authorEmail: user?.email,
          remoteUrl: repo?.html_url,
        });
        console.log(res);
        if (res.status == 200) {
          setBranch(res.data.branches[0])
          setBranches(res.data.branches)
          //setInitializedEmptyGit(true);
          setInitializing(false);
        }
      }}
    >
      <Button variant="contained" fullWidth>
        {initializing ? <CircularProgress /> : "Initialize Git"}
      </Button>
    </div>
  );
}

export default GitInit;
