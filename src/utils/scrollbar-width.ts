const cacheScrollbarWidth = new WeakMap();

export default function getScrollbarWidth(target: HTMLElement = document.body) {
  if (cacheScrollbarWidth.has(target))
    return cacheScrollbarWidth.get(target);

  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  target.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode!.removeChild(outer);
  const scrollbarWidth = widthNoScroll - widthWithScroll;

  cacheScrollbarWidth.set(target, scrollbarWidth);
  return scrollbarWidth;
};
