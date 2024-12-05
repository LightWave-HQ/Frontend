import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://lightwave.local", 
        changeOrigin: true,
        secure: false,  
        rewrite: (path) => path,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (/\.(css)$/.test(assetInfo.names)) {
            return "assets/css/index.css";
          }
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
});
