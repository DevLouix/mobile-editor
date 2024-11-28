// components/Modal.tsx
import React from "react";
import { useModal } from "../contexts/ModalContext";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const Modal: React.FC = () => {
  const { isOpen, content, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default Modal;