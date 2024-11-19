import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { AddBox, Code } from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GitAuthView from "./AuthView";
import { cloneRepo } from "@/lib/gitClient";
import { useExplorerContext } from "@/contexts/ExplorerContext";

const Repositories: React.FC = () => {
  const { showRepoView, setSessionType, setSessionDir } =
    useEditorLayoutContext();
  const { setRootDir } = useExplorerContext();
  const [repos, setRepos] = useState([]);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch("/api/github/repos");
      const data = await response.json();
      setRepos(data);
    };
    fetchRepos();
  }, []);

  async function importRepo(repo: any) {
    //await fetchRepoUrl(repo.owner.name,repo.name)
    const res = await cloneRepo(repo.html_url, repo.name);
    if (res.status == 200) {
      //console.log(res);

      setRootDir(res.data.rootFolder);
      setSessionType("git");
      setSessionDir(res.data.dirPath);
    }
  }

  return (
    <>
      {showRepoView ? (
        <Box sx={{}}>
          <h2>Select Repository</h2>
          <List>
            {repos.length > 0
              ? repos.map((repo: any) => (
                  <ListItem onClick={() => importRepo(repo)}>
                    <Code sx={{ p: 1 }} />
                    <Box key={repo.id}>
                      <Typography fontWeight={"bold"}>{repo.name}</Typography>
                    </Box>
                  </ListItem>
                ))
              : ""}
          </List>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default Repositories;
