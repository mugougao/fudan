(function (win) {
  const config = {
    mode: "development",
    wdp: {
      // sceneUrl: "https://dt3.fudan.edu.cn/service",
      sceneUrl: "http://10.108.76.203:8890/service",
      sceneOrder: "331ff3ceea96acf192b0d0c126fd6ad0",
    },
  };
  // 冻结对象,防止修改
  win.freezeObject(config);
  Object.defineProperty(window, "__config__", { value: config, writable: false, enumerable: true });
})(window);
