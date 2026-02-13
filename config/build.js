export function setupBuild() {
  // const outDir = {
  //   development: "dist.dev",
  //   production: "dist.prod",
  //   test: "dist.test",
  //   release: "dist.release",
  // }[mode] || "dist";
  return {
    includeMode: "filesInFolder",
    target: ["es2015", "edge80", "firefox78", "chrome80", "safari12"],
    cssTarget: ["es2015", "edge80", "firefox78", "chrome80", "safari12"],
    minify: "terser",
    terserOptions: {
      compress: {
        keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
        drop_console: false, // 生产环境去除 console
        drop_debugger: false, // 生产环境去除 debugger
      },
      format: {
        comments: false, // 删除注释
      },
    },
    manifest: false,
    sourcemap: false,
    outDir: "dist",
    rollupOptions: {
      plugins: [],
      // emptyOutDir: true,
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules"))
            return undefined;
          // 最小化拆分包
          return id.toString().split("node_modules/")[1].split("/")[1].toString();
        },
        entryFileNames: "js/[name].[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          let extType = info[info.length - 1];
          const extMap = [
            [/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i, "media"],
            [/\.(png|jpe?g|gif|svg)(\?.*)?$/i, "images"],
            [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i, "fonts"],
            // json
            [/\.(json)(\?.*)?$/i, "json"],
          ];
          for (const [reg, type] of extMap) {
            if (reg.test(assetInfo.name)) {
              extType = type;
              break;
            }
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        format: "es",
        globals: {},
      },
      external: [],
    },
  };
}
