import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        about: resolve(import.meta.dirname, "about.html"),
        projects: resolve(import.meta.dirname, "projects.html"),
        planner: resolve(import.meta.dirname, "planner.html"),
        contact: resolve(import.meta.dirname, "contact.html"),
      },
    },
  },
});
