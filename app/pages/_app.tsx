import EditorLayoutContextProvider from "@/contexts/EditorLayoutContext";
import ExplorerContextProvider from "@/contexts/ExplorerContext";
import { ModalProvider } from "@/contexts/ModalContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import '../styles/monaco.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      {" "}
      <EditorLayoutContextProvider>
        <ExplorerContextProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </ExplorerContextProvider>
      </EditorLayoutContextProvider>
    </SessionProvider>
  );
}
