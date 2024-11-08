import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEditorLayoutContext } from "@/contexts/EditorLayoutContext";
import { useRouter } from "next/router";
import { useModal } from "@/contexts/ModalContext";
import GitAuthView from "./AuthView";
import Repositories from "./RepoView";

export default function GitRepository() {
  const { data: session } = useSession();
  const { setShowRepoView } = useEditorLayoutContext();
  const {openModal} = useModal()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box width={"inherit"} onMouseEnter={handleClick}>
      <Typography
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="body2"
        fontWeight="bold"
        onClick={() => {   
          handleClose();  
          !session ? openModal(<GitAuthView/>): openModal(<Repositories/>);
            
          }}
        // onClick={handleClick}
        // onMouseLeave={handleClose}
      >
        Import Repository
      </Typography>
    </Box>
  );
}
