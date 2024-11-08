// pages/signin.tsx
import { Button, Container, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import GitHubIcon from "@mui/icons-material/GitHub";
import GitLabIcon from "@mui/icons-material/AccountTree"; // Placeholder icon for GitLab

export default function GitAuthView() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign in to Your Account
      </Typography>

      <Stack spacing={3} sx={{ width: "100%", mt: 2 }}>
        {/* GitHub Sign In Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          onClick={() => signIn("github")}
          sx={{
            justifyContent: "flex-start",
            px: 2,
            backgroundColor: "#333",
            "&:hover": { backgroundColor: "#24292e" },
          }}
          fullWidth
        >
          Sign in with GitHub
        </Button>

        {/* GitLab Sign In Button */}
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GitLabIcon />} // Custom icon for GitLab
          onClick={() => signIn("gitlab")}
          sx={{
            justifyContent: "flex-start",
            px: 2,
            backgroundColor: "#fc6d26",
            "&:hover": { backgroundColor: "#e24329" },
          }}
          fullWidth
        >
          Sign in with GitLab
        </Button>

        {/* GutBucket Sign In Button */}
        <Button
          variant="contained"
          startIcon={
            <Image
              src="/gutbucket-logo.svg" // Replace with the actual logo path
              alt="GutBucket"
              width={24}
              height={24}
            />
          }
          onClick={() => signIn("gutbucket")}
          sx={{
            justifyContent: "flex-start",
            px: 2,
            backgroundColor: "#555",
            "&:hover": { backgroundColor: "#444" },
          }}
          fullWidth
        >
          Sign in with BitBucket
        </Button>
      </Stack>
    </Container>
  );
}
