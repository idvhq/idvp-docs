import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@idverse/idv-sdk-web/dist/collection/assets",
          dest: "idv-sdk-web",
          rename: {
            stripBase: 5,
          },
        },
      ],
    }),
  ],
  server: {},
});
