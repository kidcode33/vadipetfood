import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  server: {
    port: 3000,
    // Netlify Functions proxy — dev ortamında AI çağrıları çalışsın
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
});
