import presetRemToPx from "@unocss/preset-rem-to-px";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
// import presetAutoprefixer from "unocss-preset-autoprefixer";
import { presetScrollbarHide } from "unocss-preset-scrollbar-hide";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig({
  content: {
    pipeline: {
      include: [
        // 默认配置
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // 包括 js/ts 文件
        "src/**/*.{js,ts}",
      ],
      // 排除文件
      exclude: ["dist", "node_modules", ".git", ".svn", "public"],
    },
  },
  presets: [
    presetWind(),
    presetUno(),
    presetAttributify(),
    presetRemToPx({ baseFontSize: 16 }),
    presetScrollbarHide(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        "display": "inline-block",
        // "vertical-align": "baseline",
        "vertical-align": "middle",
      },
      customizations: {
        iconCustomizer(collection, icon, props) {
          if (["svg-reset", "svg-raw"].includes(collection)) {
            props.width = "16px";
            props.height = "16px";
          }
        },
      },
      collections: {
        "svg": FileSystemIconLoader("./src/assets/svg", (svg: string) => {
          return svg
            .replace(/width="[^"]*"/, "width=\"16px\"")
            .replace(/height="[^"]*"/, "height=\"16px\"")
            .replace(/fill="[^"]+"/g, "fill=\"currentColor\"");
        }),
        "svg-reset": FileSystemIconLoader(
          "./src/assets/svg",
          (svg: string) =>
            svg
              .replace(/width="[^"]*"/, "width=\"16px\"")
              .replace(/height="[^"]*"/, "height=\"16px\"")
              .replace(/fill="[^"]+"/g, "fill=\"currentColor\""),
        ),
        // 原始的 svg
        "svg-raw": FileSystemIconLoader(
          "./src/assets/svg",
          (svg: string) => svg
            .replace(/width="[^"]*"/, "width=\"16px\"")
            .replace(/height="[^"]*"/, "height=\"16px\""),
        ),
        "svg-icon": FileSystemIconLoader(
          "./src/assets/svg_icon",
          (svg: string) => svg
            .replace(/width="[^"]*"/, "width=\"16px\"")
            .replace(/height="[^"]*"/, "height=\"16px\"")
            .replace(/fill="[^"]+"/g, "fill=\"currentColor\""),
        ),
        "svg-icon-raw": FileSystemIconLoader(
          "./src/assets/svg_icon",
          (svg: string) => svg
            .replace(/width="[^"]*"/, "width=\"16px\"")
            .replace(/height="[^"]*"/, "height=\"16px\""),
        ),
      },
    }),
    // presetAutoprefixer(),
  ],
  variants: [
    {
      name: "en",
      match(matcher) {
        if (!matcher.startsWith("en:")) return matcher;
        return {
          matcher: matcher.slice(3),
          selector: s => `.lang-en ${s}`,
        };
      },
    },
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  rules: [[/^wh-(\d+)(px|rem|vw|vh|em|%)$/, ([, d, u]) => ({ width: `${d}${u}`, height: `${d}${u}` })]],
  shortcuts: {
    "wh-full": "w-full h-full",
    "wh-screen": "w-screen h-screen",
    "flex-center": "flex items-center justify-center",
    "flex-y-center": "flex items-center",
    "flex-x-center": "flex justify-center",
    "flex-col": "flex flex-col",
    "flex-auto": "flex-auto overflow-hidden",
  },
  theme: {
    breakpoints: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
    },
    colors: {
      textColor: "#C4D7EE",
    },
    zIndex: {
      first: 999999,
      second: 999998,
    },
    fontFamily: {
      // 标题 字体
      // "title": ["YouSheBiaoTiHei", "AlibabaPuHuiTi-3", "sans-serif"],
      "title": ["AlimamaShuHeiTi-Bold", "AlibabaPuHuiTi-3-bold", "sans-serif"],
      // 数字 字体
      "number": ["D-DIN", "AlibabaPuHuiTi-3-bold", "AlibabaPuHuiTi-3", "sans-serif"],
      // 文本 字体
      "text": ["AlibabaPuHuiTi-3", "sans-serif"],
      // 文本 字体
      "text-medium": ["AlibabaPuHuiTi-3-medium", "AlibabaPuHuiTi-3", "sans-serif"],
      // 文本 字体
      "text-bold": ["AlibabaPuHuiTi-3-bold", "AlibabaPuHuiTi-3-medium", "AlibabaPuHuiTi-3", "sans-serif"],
    },
  },
  postprocess: [],
});
