import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        studyIndex: resolve(__dirname, "study/index.html"),
        study: resolve(__dirname, "study/study.html"),
        studyJava: resolve(__dirname, "study/java.html"),
        studyPhp: resolve(__dirname, "study/php.html"),
        monster: resolve(__dirname, "monster/index.html")
      }
    }
  },
  resolve: {
    alias: {
      three: resolve(__dirname, "vendor/three/build/three.module.js")
    }
  }
});
