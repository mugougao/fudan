import type { CSSProperties } from "vue";
import { tryOnMounted, useDebounceFn, useEventListener } from "@vueuse/core";
import round from "lodash/round";
import { computed, ref } from "vue";

interface DesignSize { width: number;height: number }

/**
 * @description: 用于大屏展示时，自动缩放屏幕
 * @param {{width:string,height:string}}  designSize 设计尺寸
 * @param {boolean} fill 是否填充满屏幕
 * @param {Function} onResize 是否填充
 * @return
 */
export function useScaleScreen(designSize: DesignSize, fill = false, onResize?: () => void) {
  // 默认设计尺寸
  const { width = 1920, height = 1080 } = designSize || {};
  // 屏幕尺寸
  const screenSize = ref({ width, height });
  // 缩放比例
  const scale = ref(1);
  // 反缩放比例
  const unScale = computed(() => 1 / scale.value);
  const style = computed<CSSProperties>(() => {
    const _width = fill ? screenSize.value.width / scale.value : width;
    const _height = fill ? screenSize.value.height / scale.value : height;
    return {
      width: `${_width}px`,
      height: `${_height}px`,
      transform: `scale(${scale.value}) translateX(-50%)`,
      // transform: `matrix(${scale.value}, 0, 0, ${scale.value}, 0, 0) translateX(-50%)`,
      transformOrigin: "left top",
      position: "absolute",
      left: "50%",
      // top: "50%",
    };
  });

  const resize = useDebounceFn(async () => {
    await nextTick();
    const screenWidth = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
    const screenHeight = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
    screenSize.value = { width: screenWidth, height: screenHeight };
    scale.value = round(Math.min(screenWidth / width, screenHeight / height), 4);
    onResize?.();
  }, 200);

  tryOnMounted(() => {
    resize();
  });

  useEventListener("resize", resize);

  return { scale, unScale, style, resize };
}
