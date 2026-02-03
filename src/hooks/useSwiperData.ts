import type { MaybeRefOrGetter } from "vue";
import { useIntervalFn } from "@vueuse/core";
import { computed, ref, toValue, watch } from "vue";

interface IOptions {
  // 可见的个数: 默认 10
  size?: MaybeRefOrGetter<number>;
  // 速度: 默认 1000
  space?: MaybeRefOrGetter<number>;
  // 滚动方向: after
  direction?: MaybeRefOrGetter<"before" | "after">;
  // 滚动数量: 默认 1
  gap?: MaybeRefOrGetter<number>;
  // 自动播放: 默认 true
  autoplay?: boolean;
}

export function useSwiperData<T>(data: MaybeRefOrGetter<T[]>, options: IOptions = {}) {
  const { size, space, direction, gap } = options;
  const _size = computed(() => toValue(size) || 10);
  const _space = computed(() => toValue(space) || 1000);
  const _direction = computed(() => toValue(direction) || "after");
  const _gap = computed(() => toValue(gap) || 1);

  // 数据源 长度 是否大于 size
  const hasPlay = computed(() => toValue(data).length > _size.value);

  const startIndex = ref(0);
  const maxIndex = computed(() => toValue(data).length);
  const endIndex = computed(() => {
    const res = startIndex.value + _size.value;
    return res > maxIndex.value ? maxIndex.value : res;
  });

  const displayData = computed<T[]>(() => {
    if (!hasPlay.value) return toValue(data);
    const _data = toValue(data).slice(startIndex.value, endIndex.value);
    if (_data.length < _size.value) {
      const _len = _size.value - _data.length;
      const arr = toValue(data).slice(0, _len);
      _data.push(...arr);
    }
    return _data;
  });

  const next = () => {
    startIndex.value = startIndex.value + _gap.value;
    if (startIndex.value > toValue(data).length - 1) {
      startIndex.value = 0;
    }
  };

  const prev = () => {
    startIndex.value = startIndex.value - _gap.value;
    if (startIndex.value < 0) {
      startIndex.value = toValue(data).length;
    }
  };

  const { pause, resume: _resume, isActive } = useIntervalFn(
    () => {
      _direction.value === "after" ? next() : prev();
    },
    _space,
    {
      immediate: options.autoplay ?? true,
    },
  );

  const resume = () => {
    if (isActive.value) return;
    if (!hasPlay.value) return;
    _resume();
  };

  // 监听数据源是否大于 size : 否开启自动播放
  watch(hasPlay, (newVal) => {
    if (!newVal) {
      pause();
    }
    else if (newVal && !isActive.value) {
      resume();
    }
  });

  watch(data, () => {
    startIndex.value = 0;
  });

  return {
    startIndex,
    // 显示的数据
    displayData,
    next,
    prev,
    // 暂停
    pause,
    // 恢复
    resume,
    // 状态
    isActive,
  };
}
