import type { MaybeRefOrGetter } from "vue";

export function useDataSlice<T>(data: MaybeRefOrGetter<T[]>, size: number = 5, reverse = false) {
  const maxStartIndex = computed(() => Math.max(0, length - size));
  const startIndex = ref(reverse ? maxStartIndex.value : 0);

  const displayData = computed(() => {
    const dataValue = toValue(data);
    if (!dataValue) return [];
    if (dataValue.length < size) return dataValue;
    return dataValue.slice(startIndex.value, startIndex.value + size);
  });

  const sliderProps = computed(() => {
    return {
      reverse,
      "data": toValue(data),
      "displaySize": size,
      "length": toValue(data).length,
      "modelValue": startIndex.value,
      "onUpdate:modelValue": (value: number) => {
        startIndex.value = value;
      },
    };
  });

  return {
    displayData,
    sliderProps,
  };
}
