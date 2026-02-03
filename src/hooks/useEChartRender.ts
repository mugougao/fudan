import type { MaybeComputedElementRef } from "@vueuse/core";
import type { ECharts, EChartsOption } from "echarts";
import type { Ref } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import * as echarts from "echarts";
import merge from "lodash/merge";
import { computed, shallowRef, toValue } from "vue";
import { sleep } from "@/utils";

interface UseEChartRenderReturnType {
  chartInstance: Ref<ECharts | undefined>;
  setOption: (option: EChartsOption, clear?: boolean) => void;
  resize: () => void;
}

export function useEChartRender(el: MaybeComputedElementRef<HTMLElement | null | undefined>, option: EChartsOption | Ref<EChartsOption>, theme?: string | Ref<string>): UseEChartRenderReturnType {
  const chartRef = computed(() => toValue(el));
  const optionRef = computed(() => toValue(option)) as Ref<EChartsOption>;
  const chartInstance = shallowRef() as Ref<ECharts | undefined>;

  const resize = useDebounceFn(() => {
    if (!chartInstance.value)
      return;
    chartInstance.value.resize();
  }, 200);

  useResizeObserver(chartRef, resize);
  // 这里监听 chartRef 的变化，如果 chartRef 有值，就创建 ECharts 实例，否则销毁 ECharts 实例
  // 这样就可以在组件销毁时，销毁 ECharts 实例
  // watchPostEffect 会在组件更新后执行，这样可以保证在组件更新后，chartRef 有值
  // v-if 会在组件更新后执行，这样可以保证在组件更新后，chartRef 有值

  const create = () => {
    if (chartRef.value) {
      // 创建 ECharts 实例
      chartInstance.value = toValue(theme)
        ? echarts.init(chartRef.value, toValue(theme), { renderer: "svg" })
        : echarts.init(chartRef.value, "default", { renderer: "svg" });
      chartInstance.value.setOption(optionRef.value);
    }
  };

  const destroyed = () => {
    if (chartInstance.value) {
      (chartInstance.value as ECharts).dispose();
      chartInstance.value = undefined;
    }
  };

  const setOption = (option: EChartsOption, clear = true) => {
    const _option = merge(optionRef.value, option);
    clear && chartInstance.value?.clear();
    chartInstance.value?.setOption(_option);
  };

  watch(
    () => chartRef.value,
    async () => {
      // await nextTick();
      await sleep(500);
      chartRef.value ? create() : destroyed();
    },
    { immediate: true, deep: true },
  );

  watch(
    () => optionRef.value,
    () => {
      chartInstance.value?.setOption(optionRef.value);
    },
    { deep: true, immediate: true },
  );

  watch(
    () => toValue(theme),
    () => {
      destroyed();
      create();
    },
  );

  return {
    chartInstance,
    setOption,
    resize,
  };
}
