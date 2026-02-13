import fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";

export default function configFilePlugin() {
  let viteConfig = null;
  return {
    name: "config-file-plugin",
    apply: "build",
    config(config, ctx) {
      const { command, mode } = ctx;
      const isDev = command === "serve";
      const isProd = command === "build";
      // 存储配置信息供其他钩子使用
      viteConfig = {
        command,
        mode,
        isDev,
        isProd,
        base: config.base || "/",
      };
      // console.log("🚀 ~ configFilePlugin ~ viteConfig:", viteConfig);
      return null;
    },
    // apply: "build",
    // 转换 index.html
    transformIndexHtml(html) {
      const configFile = viteConfig.isProd ? "config_pro.js" : "config_dev.js";
      // console.log("🚀 ~ configFilePlugin ~ configFile:", configFile);
      // 移除原有的 script 标签，添加新的
      const updatedHtml = html.replace(/<script.*config_(dev|pro)\.js.*<\/script>/, `<script defer="defer" src="${viteConfig.base}${configFile}"></script>`);
      return updatedHtml;
    },
    // 构建结束时删除开发配置文件
    closeBundle() {
      const outDir = path.resolve(cwd(), "dist");
      const devConfigPath = path.join(outDir, "config_dev.js");
      if (fs.existsSync(devConfigPath)) {
        fs.unlinkSync(devConfigPath);
        console.log("已删除开发配置文件: config_dev.js");
      }
    },
    // 覆盖 public 目录复制行为
    writeBundle() {
      const publicDir = path.resolve(cwd(), "public");
      const outDir = path.resolve(cwd(), "dist");
      // 确保生产配置文件被复制
      const proConfigPath = path.join(publicDir, "config_pro.js");
      const outProConfigPath = path.join(outDir, "config_pro.js");
      if (fs.existsSync(proConfigPath)) {
        fs.copyFileSync(proConfigPath, outProConfigPath);
      }
    },
  };
}
