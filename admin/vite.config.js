import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    allowedHosts: [
      'cafcd26dd87a.ngrok-free.app',
      'localhost',
      '127.0.0.1',
    ],

  }
});
