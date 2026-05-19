import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { JSX as LocalJSX } from "@idverse/idv-sdk-web";
import { defineCustomElements } from "@idverse/idv-sdk-web/loader";
import { HTMLAttributes } from "react";

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, "className"> & {
      class?: string;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Initiate IDVerseSDK UI components.
defineCustomElements(window, {
  // It can be any path where you are hosting the assets (which were provided along with the sdk build)
  // Copy the whole folder called assets from idverse-sdk-browser/ui/dist/idverse-sdk-browser-ui/assets
  // i.e now images are expected to be found in /sdk-idverse/assets/images
  resourcesUrl: "/idv-sdk-web/",
});
