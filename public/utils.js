(function (win) {
  // 冻结对象,防止修改
  function freezeObject(obj) {
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

  win.freezeObject = freezeObject;
})(window);
