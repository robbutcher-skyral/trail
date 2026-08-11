import lensConfigPlugin from "@adk/lens-react/vite-plugin";
import { protomapsAssetsPlugin } from "@adk/vite-plugin-protomaps-assets";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    lensConfigPlugin(),
    protomapsAssetsPlugin({ flavors: ["dark"] }),
  ],
  resolve: {
    dedupe: ["@emotion/react", "@emotion/styled"],
  },
});
