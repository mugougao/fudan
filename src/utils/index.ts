import type { EChartsOption } from "echarts";
import { type ClassValue, clsx } from "clsx";
import get from "lodash/get";
import isNaN from "lodash/isNaN";
import round from "lodash/round";
import { twMerge } from "tailwind-merge";
import { camelize } from "vue";

// 获取assets静态资源
export function getAssetsFile(url: string) {
  return new URL(`../assets/images/${url}`, import.meta.url).href;
}

/**
 * 延迟执行
 * @param time
 */
export const sleep = (time: number = 200) => new Promise(resolve => setTimeout(resolve, time));

/**
 * 同步延迟执行
 * @param time
 */
export function sleepSync(time: number = 200) {
  const start = Date.now();
  while (Date.now() - start < time) {
    // 循环等待一段时间
  }
}

/**
 * 获取Y轴范围,用于echarts
 * @param {number[]} data
 * @param {number} [paddingPercent] - 0.5
 * @param {number} [precision] - 0.5
 */
export function adjustYAxisRange(data: number[], paddingPercent = 0.5, precision = 2) {
  // 计算数据的最大值和最小值
  const dataMax = Math.max(...data);
  const dataMin = Math.min(...data);
  // 计算数据范围
  const range = dataMax - dataMin;
  // 计算偏移量
  const padding = round(range * paddingPercent, precision);
  // 返回新的Y轴范围
  return {
    min: dataMin - padding,
    max: dataMax + padding,
  };
}

/**
 * 合并className
 * @param inputs
 */
export function mergeClassName(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const cn = mergeClassName;

/**
 * 数字转换为千分位格式
 * @param num
 */
export function numberToThousands(num: number | string) {
  if (!num) return num;
  try {
    return num.toString().replace(/\d+/, (n) => {
      return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
        return `${$1},`;
      });
    });
  }
  catch (e) {
    return num;
  }
}

/**
 * 简单的深拷贝
 * @param obj
 */
export function easyClone<T>(obj: T): T {
  if (obj == null) return obj;
  if (typeof obj !== "object") return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * number转css单位
 * @param num
 */
export function numberToCss(num: number | string) {
  if (num == null) return num;
  if (typeof num === "number") return `${num}px`;
  // 正则校验数字，可包含小数
  if (/^\d+(?:\.\d*)?$/.test(num)) return `${num}px`;
  return num;
}

/**
 * 将数字转换为带单位
 * @param num
 * @param precision 小数位数
 */
export function convertNumber(num: number | string, precision?: number): string {
  // 将输入转换为数字
  const _num = Number(num);
  if (isNaN(_num)) return num.toString(); // 如果转换失败，返回原字符串

  // 定义单位映射，按从大到小排序
  const unitMap = [
    { value: 1e8, unit: "亿" },
    { value: 1e7, unit: "千万" },
    { value: 1e6, unit: "百万" },
    { value: 1e4, unit: "万" },
    { value: 1e3, unit: "千" },
    // { value: 1e2, unit: "百" },
    { value: 1, unit: "" },
  ];

  // 获取数字的绝对值和符号
  const absNum = Math.abs(_num);
  const isNegative = _num < 0;

  // 找到合适的单位
  const { value: standardNum, unit } = unitMap.find(({ value }) => absNum >= value) || { value: 1, unit: "" };

  // 计算转换后的值
  let result = absNum / standardNum;
  if (precision !== undefined) {
    result = Math.round(result * 10 ** precision) / 10 ** precision;
  }

  // 返回带符号和单位的结果
  return `${isNegative ? "-" : ""}${result}${unit}`;
}

// 中文排序 , 然后按长度排
export function sortChinese(arr: string[], field: string) {
  return arr.sort((a, b) => {
    const aValue = get(a, field);
    const bValue = get(b, field);

    if (aValue.length === bValue.length) {
      return aValue.localeCompare(bValue, "zh-CN");
    }
    return aValue.length - bValue.length;
  });
}

/**
 * 创建一个可取消的异步任务：自动取消之前的任务
 * @param promiseFnc
 */
export function createCancellableTask<T, R extends any[]>(promiseFnc: (...args: R) => Promise<T>) {
  let cancel: ((() => void) | null) = null;
  return (...args: R) =>
    new Promise((resolve, reject) => {
      cancel && cancel();
      cancel = () => {
        resolve = reject = () => {};
      };
      promiseFnc(...args).then(resolve, reject).finally(() => (cancel = null));
    });
}

/**
 * createEChartsLinearGradient / createEChartsRadialGradient 颜色格式转换
 * @param colors
 */
function colorStopsTransform(colors: string[] | { color: string; offset: number }[]) {
  let colorStops: { offset: number; color: string }[];
  if (Array.isArray(colors) && colors.every(item => typeof item === "string")) {
    const step = 1 / (colors.length - 1);
    colorStops = colors.map((color, index) => ({
      offset: index * step,
      color,
    }));
  }
  else {
    colorStops = colors;
  }
  return colorStops;
}

/**
 * 创建echarts的线性渐变
 * @param {(string[]|{color: string; offset: number }[])}  colors
 * @param {[number,number,number,number]} [direction] - [0,0,0,1]
 * @param {boolean} [global] - false
 */
export function createEChartsLinearGradient(colors: string[] | { color: string; offset: number }[], direction = [0, 0, 0, 1], global = false) {
  const colorStops = colorStopsTransform(colors);
  const [x, y, x2, y2] = direction;
  return {
    type: "linear",
    global,
    x,
    y,
    x2,
    y2,
    colorStops,
  } as EChartsOption["color"];
}

/**
 * 创建echarts的径向渐变
 * @param {(string[]|{color: string; offset: number }[])} colors
 * @param {[number,number,number]} [position] - [0,0,0]
 * @param {boolean} [global] - false
 */
export function createEChartsRadialGradient(colors: string[] | { color: string; offset: number }[], position = [0, 0, 0], global = false) {
  // 处理颜色简写
  const colorStops = colorStopsTransform(colors);
  const [x, y, r] = position;
  return {
    type: "radial",
    global,
    x,
    y,
    r,
    colorStops,
  } as EChartsOption["color"];
}

export function createEChartsBarBackground(widthPercent: number = 0.6) {
  return function (params: any, api: any) {
    const start = api.coord([api.value(0)]);
    const width = (params.coordSys.width / params.dataInsideLength) * widthPercent;
    return {
      type: "rect",
      shape: {
        x: start[0] - width / 2,
        y: params.coordSys.y,
        width,
        height: params.coordSys.height,
      },
      style: api.style(),
    };
  };
}

/**
 * 使用最大余数法计算百分比，确保百分比总和为100%饼图数据处理
 * @param items
 * @param decimalPlaces
 */
export function largestRemainderMethod(
  items: { name: string; value: number }[],
  decimalPlaces: number = 2,
): { name: string; value: number; percent: number; originalPercent: number }[] {
  // 计算总价值
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return items.map(item => ({
      name: item.name,
      value: item.value,
      percent: 0,
      originalPercent: 0,
    }));
  }

  // 计算原始百分比（未舍入）
  const itemsWithOriginalPercent = items.map(item => ({
    ...item,
    originalPercent: (item.value / total) * 100,
  }));

  // 计算舍入后的百分比和余数
  const itemsWithRoundedPercent = itemsWithOriginalPercent.map((item) => {
    const factor = 10 ** decimalPlaces;
    const roundedPercent = Math.floor(item.originalPercent * factor) / factor;
    const remainder = item.originalPercent - roundedPercent;

    return {
      ...item,
      roundedPercent,
      remainder,
    };
  });

  // 计算舍入后的百分比总和
  const roundedTotal = itemsWithRoundedPercent.reduce(
    (sum, item) => sum + item.roundedPercent,
    0,
  );

  // 计算需要分配的剩余百分比
  const remaining = 100 - roundedTotal;
  const remainingFactor = 10 ** decimalPlaces;
  const remainingInteger = Math.round(remaining * remainingFactor);

  if (remainingInteger !== 0) {
    // 按余数降序排序
    const sortedItems = [...itemsWithRoundedPercent].sort(
      (a, b) => b.remainder - a.remainder,
    );

    // 分配剩余的百分比
    let remainingToDistribute = remainingInteger;
    const result = sortedItems.map((item) => {
      let adjustment = 0;

      if (remainingToDistribute > 0) {
        adjustment = 1 / remainingFactor;
        remainingToDistribute--;
      }

      return {
        name: item.name,
        value: item.value,
        percent: Number((item.roundedPercent + adjustment).toFixed(decimalPlaces)),
        originalPercent: item.originalPercent,
      };
    });

    return result;
  }
  else {
    // 如果不需要分配剩余百分比，直接返回舍入后的结果
    return itemsWithRoundedPercent.map(item => ({
      name: item.name,
      value: item.value,
      percent: Number(item.roundedPercent.toFixed(decimalPlaces)),
      originalPercent: item.originalPercent,
    }));
  }
}

/**
 * 补全小数位数，不足的小数位补零
 * @param {number} num 需要补全的数字
 * @param {number} decimalPlaces 需要保留的小数位数
 * @returns {string} 补全后的字符串
 */
export function padDecimals(num, decimalPlaces) {
  if (isNaN(num)) return "0";

  const numStr = num.toString();
  const parts = numStr.split(".");

  if (parts.length === 1) {
    // 整数情况，直接添加小数点和补零
    return `${parts[0]}.${"0".repeat(decimalPlaces)}`;
  }

  const integerPart = parts[0];
  let decimalPart = parts[1];

  if (decimalPart.length < decimalPlaces) {
    // 小数位数不足，补零
    decimalPart = decimalPart.padEnd(decimalPlaces, "0");
  }
  else if (decimalPart.length > decimalPlaces) {
    // 小数位数超过，截断并四舍五入
    const factor = 10 ** decimalPlaces;
    const roundedNum = Math.round(Number.parseFloat(numStr) * factor) / factor;
    return padDecimals(roundedNum, decimalPlaces);
  }

  return `${integerPart}.${decimalPart}`;
}

// 高亮文字
export function highlightText(text: string, keyword: string, highlightColor: string = "red") {
  return text.replace(new RegExp(keyword, "gi"), match => `<span style="color:${highlightColor}">${match}</span>`);
}

// 数字单位： 个 => 亿： 100000000 => 1.00
export function convertToHundredMillion(num: number, decimalPlaces?: number) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new TypeError("输入必须为有效数字");
  }
  const result = num / 100000000;
  if (decimalPlaces) {
    return Number(result.toFixed(decimalPlaces));
  }
  return result;
}

// 数字单位： 个 => 万： 10000 => 1.00
export function convertToTenThousand(num: number, decimalPlaces?: number) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new TypeError(`输入必须为有效数字：${num}`);
  }
  if (num === 0) return 0;
  const result = num / 10000;
  if (decimalPlaces) {
    return Number(result.toFixed(decimalPlaces));
  }
  return result;
}

export function camelizeProps<T extends Record<string, any>>(props: T) {
  return Object.entries(props)
    .reduce(
      (prev, [key, value]) => {
        const camelizeKey = camelize(key) as keyof T;
        prev[camelizeKey] = value;
        return prev;
      },
      {} as T,
    );
}

// 冻结对象
export function freezeObject(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        if (["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(value))) freezeObject(value);
        return value;
      },
    });
  });
}

// 使用正则表达式匹配所有 {key} 格式的占位符
export function replaceTemplate(str, data, defaultValue: any = "") {
  return str.replace(/\{([^{}]+)\}/g, (match, key) => {
    const path = key.trim();
    const value = get(data, path);
    return value ?? defaultValue ?? match;
  });
}
