import type { Rule } from "ant-design-vue/es/form";

export {};

declare global {
  interface IFormRules<T extends Record<string, any> = Record<string, any>> {
    [key: keyof T | string]: Rule[];
  }
}
