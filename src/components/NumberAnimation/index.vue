<script setup lang="ts">
import debounce from "lodash/debounce";
import round from "lodash/round";

defineOptions({ name: "NumberAnimation" });

const props = withDefaults(defineProps<{
  formValue?: number | string;
  toValue: number | string;
  duration?: number;
  onUpdate?: (value: number) => void;
  onFinish?: () => void;
  format?: (value: number, isFinish: boolean) => string | number;
  precision?: number;
}>(), {
  formValue: 0,
  duration: 2000,
  precision: 0,
});

function toNumber(value: number | string) {
  const num = Number(value);
  return !Number.isNaN(num) && Number.isFinite(num) ? num : 0;
}

const isFinish = ref(true);
const value = ref(toNumber(props.formValue));
function setValue(val: number) {
  const { precision } = props;
  value.value = round(val, precision);
}

interface animationProps {
  formValue: number;
  toValue: number ;
  duration: number;
  onUpdate: (value: number) => void;
  onFinish: () => void;
}
const easeOut = (t: number): number => 1 - (1 - t) ** 5;
function animation(props: animationProps) {
  const { formValue, toValue, duration, onUpdate, onFinish } = props;
  if (formValue === toValue) return;
  const startTime = Date.now();
  const tick = () => {
    const currentTime = Date.now();
    const elapsedTime = Math.min(currentTime - startTime, duration);
    if (elapsedTime === duration) {
      onUpdate(toValue);
      onFinish();
      return;
    }
    // onUpdate(formValue + (toValue - formValue) * elapsedTime / duration);
    onUpdate(formValue + (toValue - formValue) * easeOut(elapsedTime / duration));
    requestAnimationFrame(tick);
  };
  tick();
}

const run = debounce(() => {
  isFinish.value = false;
  animation({
    formValue: value.value,
    toValue: toNumber(props.toValue),
    duration: props.duration,
    onUpdate(val) {
      setValue(val);
      props.onUpdate?.(value.value);
    },
    onFinish() {
      isFinish.value = true;
      props.onFinish?.();
    },
  });
});

watch(
  () => props.toValue,
  () => run(),
  { immediate: true, flush: "post" },
);
</script>

<template>
  <!-- 数字动画 -->
  <span class="number-animation inline-block">
    {{ props.format ? props.format(value, isFinish) : value }}
  </span>
</template>

<style scoped>

</style>
