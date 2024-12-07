import EditorLayoutContextProvider from "@/contexts/EditorLayoutContext";
import ExplorerContextProvider from "@/contexts/ExplorerContext";
import { ModalProvider } from "@/contexts/ModalContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/monaco.css";
import { FileBrowserContextProvider } from "@/contexts/FileBrowserContext";
import { GitContextProvider } from "@/contexts/Explorer/GitContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ToastContainer/>
      <EditorLayoutContextProvider>
        <ExplorerContextProvider>
          <FileBrowserContextProvider>
            <GitContextProvider>
            <ModalProvider>
              <Component {...pageProps} />
            </ModalProvider>
            </GitContextProvider>
          </FileBrowserContextProvider>
        </ExplorerContextProvider>
      </EditorLayoutContextProvider>
    </SessionProvider>
  );
}
