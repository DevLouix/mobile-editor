import ExplorerContextProvider from "@/contexts/ExplorerContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ExplorerContextProvider>
      <Component {...pageProps} />
    </ExplorerContextProvider>
  );
}
