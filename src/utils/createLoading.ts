import type { VNode } from "vue";
import { Spin } from "ant-design-vue";
import { createVNode, defineComponent, h, reactive, render } from "vue";

const loadingList = [] as ReturnType<typeof createLoading>[];

export function closeAllLoading() {
  loadingList.length && loadingList.forEach(instance => instance && instance.close());
}

interface LoadingProps {
  target?: HTMLElement;
  isFullScreen?: boolean;
  tip?: string;
  size?: "small" | "default" | "large";
  // wrapperClassName?: string;
  delay?: number;
  indicator?: VNode;
  background?: string;
}

const hasOpenFullScreenLoading = false;

export type ICreateLoading = ReturnType<typeof createLoading>;
export function createLoading(loadingProps?: LoadingProps) {
  const { target, ...props } = loadingProps ?? {};
  let isFullScreen = loadingProps?.isFullScreen ?? false;
  if (!target)
    isFullScreen = true;
  if (isFullScreen && hasOpenFullScreenLoading)
    return;
  let divRelative = false; // 是否有relative类名
  let div: any = document.createElement("div");
  div.style.top = "0";
  div.style.left = "0";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.zIndex = "10000";
  div.style.background = loadingProps?.background ?? "rgba(0, 0, 0, 0.3)";
  // div.style.background = loadingProps?.background ?? "rgba(255,31,31,0.1)";
  div.style.position = isFullScreen ? "fixed" : "absolute";
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";

  const data = reactive({
    ...props,
    loading: true,
    tip: loadingProps?.tip || "加载中...",
  });

  const loading = defineComponent({
    render() {
      return h(Spin, { ...data });
    },
  });
  const loadingInstance = createVNode(loading);
  render(loadingInstance, div);

  if (isFullScreen) {
    document.body.appendChild(div);
  }
  else if (target) {
    // 初始dom是否有relative类名
    if (target.classList.contains("relative"))
      divRelative = true;
    target.classList.add("relative");
    target.appendChild(div);
  }

  const instance = {
    vm: loadingInstance,
    close: () => {
      // await nextTick();
      if (isFullScreen) {
        div && document.body.contains(div) && document.body.removeChild(div);
      }
      else if (target) {
        if (!divRelative)
          target?.classList?.remove?.("relative");
        div && target?.removeChild?.(div);
        div = null;
      }
      const index = loadingList.indexOf(instance);
      if (index > -1)
        loadingList.splice(index, 1);
    },
    update: (newProps: Partial<LoadingProps>) => {
      Object.assign(data, newProps);
    },
    get loading() {
      return data.loading;
    },
    get $el() {
      return div;
    },
  };
  loadingList.push(instance);
  return instance;
}
