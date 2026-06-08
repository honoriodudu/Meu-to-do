import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // O dyadComponentTagger só será ativado se o comando for 'serve' (desenvolvimento)
  plugins: [
    command === "serve" ? dyadComponentTagger() : null, 
    react()
  ].filter(Boolean), // Remove o 'null' da lista no build de produção
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));