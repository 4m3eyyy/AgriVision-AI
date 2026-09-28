import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  nitro: {
    preset: "render-com",
  },

  vite: {
    server: {
      host: "0.0.0.0",
      port: 8080,
    },
  },
});