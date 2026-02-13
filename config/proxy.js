/**
 * @example
 * {
 *   '/api': {
 *     target: 'http://127.0.0.1:9528',
 *     changeOrigin: true,
 *     // rewrite: (path: string) => path.replace(/^\/api/, ''),
 *   },
 *   '/api2': 'http://127.0.0.1:9528'
 * }
 */
const proxyMap = {
  "/api": {
    // target: "http://127.0.0.1:9528", // 原先的
    target: "http://10.108.76.202:28963",
    changeOrigin: true,
  },
  "/ETLApi": {
    target: "http://10.108.76.202:28966",
    changeOrigin: true,
  },
  "/fudan": {
    // target: "http://127.0.0.1:9528", // 原先的
    target: "https://id.fudan.edu.cn",
    changeOrigin: true,
  },
  "/apiassets": {
    target: "http://10.108.76.202:28964",
    changeOrigin: true,
  },
};
export function setupProxy() {
  return Object.entries(proxyMap).reduce((pre, [key, value]) => {
    const type = typeof value;
    if (type === "string") {
      pre[key] = {
        target: value,
        changeOrigin: true,
        rewrite: path => path.replace(key, ""),
      };
    }
    else if (type === "object") {
      pre[key] = {
        rewrite: path => path.replace(key, ""),
        ...value,
      };
    }
    return pre;
  }, {});
}
