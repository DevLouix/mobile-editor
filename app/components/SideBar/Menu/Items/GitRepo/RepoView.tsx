import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { AddBox, Code } from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Repositories: React.FC = () => {
  const { showRepoView } = useEditorLayoutContext();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch("/api/github/repos");
      const data = await response.json();
      setRepos(data);
    };
    fetchRepos();
  }, []);

  return (
    <Box sx={{}}>
      <h2>Your Repositories:</h2>
      <List>
        {repos.map((repo: any) => (
          <ListItem >
            <Code sx={{p:1}}/>
            <Box key={repo.id}><Typography fontWeight={'bold'}>{repo.name}</Typography></Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Repositories;
