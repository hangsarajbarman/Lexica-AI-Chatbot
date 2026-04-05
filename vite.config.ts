import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 👈 Allows access via local IP (like 192.168.1.7)
    port: 5173, // 👈 Matches your Spotify redirect URI
  },
});
