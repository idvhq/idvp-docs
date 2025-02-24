import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ["..", "../../engine-5"],
    },
  },
});
