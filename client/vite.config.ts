import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  base: "/", // Required for Render routing

  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // ✅ PWA Plugin
    VitePWA({
      registerType: "autoUpdate", // Automatically update SW
      includeAssets: ["favicon.svg", "robots.txt"],

      // 👇 Web App Manifest (no `serviceworker` key here!)
      manifest: {
        name: "My App",
        short_name: "App",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // 👇 Workbox settings to control caching
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      // 👇 Enable service worker in dev mode for testing
      devOptions: {
        enabled: true,
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
