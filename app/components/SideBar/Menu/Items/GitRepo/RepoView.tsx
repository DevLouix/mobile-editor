import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { AddBox } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const Repositories: React.FC = () => {
    const {showRepoView} = useEditorLayoutContext()
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
    <>
    {showRepoView ?
    <Box sx={{
      position:"absolute",
      left : 50,
      right:50
    }}>
      <h2>Your Repositories:</h2>
      <ul>
        {repos.map((repo: any) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </Box>:""}</>
  );
};

export default Repositories;
