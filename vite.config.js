import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "import.meta.env.VITE_LOGIN_ID": JSON.stringify(
        env.LOGIN_ID ?? env.VITE_LOGIN_ID ?? ""
      ),
      "import.meta.env.VITE_LOGIN_SUCCESS_ID": JSON.stringify(
        env.LOGIN_SUCCESS_ID ?? env.VITE_LOGIN_SUCCESS_ID ?? ""
      )
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          auth: resolve(__dirname, "auth.html"),
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
  };
});
