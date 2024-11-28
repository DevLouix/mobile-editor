// context/ModalContext.tsx
import Modal from "@/components/Modal";
import React, { createContext, useContext, useState, ReactNode, ReactElement, Dispatch, SetStateAction } from "react";

interface ModalContextType {
  isOpen: boolean;
  content: ReactNode;
  setContent:Dispatch<SetStateAction<ReactNode>>
  openModal: (content: ReactElement) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (newContent: ReactElement) => {
    setContent(newContent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content,setContent, openModal, closeModal }}>
      {children}
      <Modal/>
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
