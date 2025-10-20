import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const mockScgHealth = (): Plugin => ({
  name: "mock-scg-health",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/check/hostHealth", (req, res, next) => {
      if (req.method && req.method.toUpperCase() !== "GET") {
        return next();
      }

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify([
        ["A", "connected"],
        ["B", "disconnected"],
        ["C", "connected"],
      ]));
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'development' && mockScgHealth(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
