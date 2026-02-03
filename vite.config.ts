import path from "node:path";

import { fileURLToPath, URL } from "node:url";
import autoprefixer from "autoprefixer";
import { defineConfig, loadEnv } from "vite";
import { parseEnv, setupBuild, setupPlugins, setupProxy } from "./config";

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const { command, mode } = configEnv;

  const isBuild = command === "build";

  // eslint-disable-next-line node/prefer-global/process
  const rootPath = path.resolve(process.cwd());
  // eslint-disable-next-line node/prefer-global/process
  const env = parseEnv(loadEnv(mode, process.cwd()));

  const port = env.VITE_PORT || 3000;
  const options = { env, isBuild, rootPath };
  console.log("=>(vite.config.ts:20) mode", mode);
  console.log("=>(vite.config.ts:21) isBuild", isBuild);
  console.log("=>(vite.config.ts:22) env", env);

  return {
    base: isBuild ? "./" : "/",
    server: {
      hmr: true,
      port,
      host: "0.0.0.0",
      proxy: setupProxy(),
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"],
      },
    },
    plugins: setupPlugins(configEnv, options),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // 省略文件扩展名
      // extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    esbuild: {
      // drop: isBuild ? ["console", "debugger"] : [],
    },
    assetsInclude: ["**/*.bak"],
    build: setupBuild(),
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "> 0.1%",
              "Last 2 versions",
              "not ie <= 8",
              "IE 10",
              "iOS >= 8",
              "Firefox >= 20",
              "Android > 4.4",
            ],
            grid: true,
          }),
        ],
      },
    },
  };
});
