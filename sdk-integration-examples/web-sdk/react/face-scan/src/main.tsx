import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/* eslint-disable */
import { JSX as LocalJSX } from "@idverse/idverse-sdk-browser/ui";
import {
  defineCustomElements,
  applyPolyfills,
} from "@idverse/idverse-sdk-browser/ui/loader";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Initiate IDVerseSDK UI components.
applyPolyfills().then(() => {
  defineCustomElements();
});
