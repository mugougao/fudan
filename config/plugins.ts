import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import { codeInspectorPlugin } from "code-inspector-plugin";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
// import eslint from "vite-plugin-eslint2";
import { createHtmlPlugin } from "vite-plugin-html";
import viteImagemin from "vite-plugin-imagemin";
import vueDevTools from "vite-plugin-vue-devtools";
import configFilePlugin from "./vite-plugin-config-file";

export function setupPlugins(configEnv: any, options: { env: IViteEnv; isBuild: boolean; rootPath: string }) {
  const { env, isBuild } = options;
  const result = [
    vue(),
    vueJsx(),
    vueDevTools({
      componentInspector: true,
      launchEditor: "code",
      // launchEditor: "webstorm",
    }),
    // codeInspectorPlugin({
    //   bundler: "vite",
    //   editor: "code",
    //   // enforcePre: false,
    //   // showSwitch: true,
    // }),
    UnoCSS(),
    createHtmlPlugin({
      minify: isBuild,
      inject: {
        data: {
          title: env.VITE_APP_TITLE,
        },
      },
    }),
    // https://github.com/ModyQyW/vite-plugin-eslint2?tab=readme-ov-file
    // eslint(),
    // https://github.com/antfu/unplugin-auto-import 自动导入
    AutoImport({
      resolvers: [],
      imports: ["vue", "pinia", "@vueuse/core", "vue-router"],
      // dirs: ['src/utils'],
      dts: "./types/auto-imports.d.ts",
      // dts: true,
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
    }),
    // https://github.com/antfu/unplugin-vue-components 自动导入组件
    Components({
      resolvers: [
        IconsResolver({
          prefix: "i",
          enabledCollections: ["svg", "svg-reset", "ri", "icon-park-outline", "ant-design"],
        }),
      ],
      types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
      dirs: ["src/components"],
      extensions: ["vue", "tsx", "jsx"],
      directoryAsNamespace: true,
      dts: "./types/components.d.ts",
      // dts: true,
      // filters for transforming targets
      include: [/\.(vue)$/, /\.vue\?vue/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    }),
    Icons({
      compiler: "vue3",
      scale: 1.2,
      defaultStyle: "display: inline-block; vertical-align: middle;",
      jsx: "react",
      customCollections: {
        // svg: FileSystemIconLoader(svgPath, (svg: string) =>
        //     svg.replace(/width="[^"]+"/g, 'width="1em"').replace(/height="[^"]+"/g, 'height="1em"')
        // ),
        // 'svg-reset': FileSystemIconLoader(svgPath, (svg: string) =>
        //     svg
        //         .replace(/fill="[^"]+"/g, 'fill="currentColor"')
        //         .replace(/width="[^"]+"/g, 'width="1em"')
        //         .replace(/height="[^"]+"/g, 'height="1em"')
        // )
      },
    }),
    configFilePlugin(),
  ];

  if (isBuild) {
    result.push(
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        svgo: {
          plugins: [
            { name: "removeViewBox" },
            { name: "removeEmptyAttrs", active: false },
          ],
        },
      }),
    );
  }

  return result;
}
