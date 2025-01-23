import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { JSX as LocalJSX } from "@idverse/idverse-sdk-browser/ui";
import { defineCustomElements } from "@idverse/idverse-sdk-browser/ui/loader";
import { HTMLAttributes } from "react";

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, "className"> & {
      class?: string;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Initiate IDVerseSDK UI components.
defineCustomElements();
