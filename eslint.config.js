import antfu from "@antfu/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default antfu(
  {
    formatters: true,
    unocss: true,
    vue: {
      overrides: {
      // https://eslint.vuejs.org/rules/html-closing-bracket-newline.html
        "vue/html-closing-bracket-newline": [
          "error",
          {
            singleline: "never",
            multiline: "never",
            selfClosingTag: {
              singleline: "never",
              multiline: "never",
            },
          },
        ],
        "vue/max-attributes-per-line": [
          "error",
          {
            singleline: {
              max: 5,
            },
            multiline: {
              max: 5,
            },
          },
        ],
        "no-async-promise-executor": "off",
        // 0: off, 1: warn, 2: error
        // 尽可能将 var let 转换成 const
        "prefer-const": "error",
        // 必须使用let 或 const, 不能使用var
        "no-var": "error",
        // 禁止不必要的转义字符
        "no-useless-escape": "off",
        "no-case-declarations": "off",
        // 关闭名称校验
        "vue/multi-word-component-names": "off",
        // 关闭 没有未使用的变量 警告 ts/js
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "vue/no-v-for-template-key": "off",
        "vue/no-use-v-if-with-v-for": "off",
      },
    },
    stylistic: {
      indent: 2, // 默认缩进2个空格
      semi: true, // 默认使用分号
      quotes: "double", // 默认使用双引号
    },
    html: true,
    typescript: true,
    jsonc: true,
    yaml: true,
  },
  // tailwind.configs["flat/recommended"],
  ...compat.config({
    extends: [
    // Other extends...
    ],
    globals: {
      mapboxgl: true,
      ol: true,
      Cesium: true,
      $: true,
    },
    rules: {
    // Other rules...
      "no-debugger": "off",
      "no-console": "off",
      "antfu/if-newline": "off",
      "eqeqeq": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-vars": "off",
    },
  }),
);
