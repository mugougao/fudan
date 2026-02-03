import type { MaybeComputedElementRef } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";

interface IUseDragPopupOptions {
  targetElement: MaybeComputedElementRef<HTMLElement | null | undefined>;
  handleElement: MaybeComputedElementRef<HTMLElement | null | undefined>;
  containerElement: MaybeRefOrGetter<HTMLElement | null | undefined>;
  scale?: MaybeRefOrGetter<number>;
}
export function useDragPopup(options: IUseDragPopupOptions) {
  const targetElement = computed(() => toValue(options.targetElement));
  const containerElement = computed(() => toValue(options.containerElement));
  const scale = computed(() => toValue(options.scale) || 1);

  const { x, y, isDragging } = useDraggable(
    targetElement,
    {
      handle: options.handleElement,
    },
  );

  const startX = ref<number>(0);
  const startY = ref<number>(0);
  const startedDrag = ref(false);
  const transformX = ref(0);
  const transformY = ref(0);
  const preTransformX = ref(0);
  const preTransformY = ref(0);
  const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
  watch([x, y], () => {
    if (!startedDrag.value) {
      startX.value = x.value;
      startY.value = y.value;
      const bodyRect = containerElement.value!.getBoundingClientRect();
      const titleRect = targetElement.value!.getBoundingClientRect();
      dragRect.value.right = bodyRect.width - titleRect.width;
      dragRect.value.bottom = bodyRect.height - titleRect.height;
      preTransformX.value = transformX.value;
      preTransformY.value = transformY.value;
    }
    startedDrag.value = true;
  });
  watch(isDragging, () => {
    if (!isDragging) {
      startedDrag.value = false;
      containerElement.value!.classList.remove("select-none");
    }
    else {
      containerElement.value!.classList.add("select-none");
    }
  });

  watchEffect(() => {
    if (startedDrag.value) {
      const moveX = Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) - startX.value;
      const moveY = Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) - startY.value;
      transformX.value = preTransformX.value + moveX / scale.value;
      transformY.value = preTransformY.value + moveY / scale.value;
    }
  });

  const style = computed(() => ({
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  }));

  // 重置
  function reset() {
    startX.value = 0;
    startY.value = 0;
    startedDrag.value = false;
    transformX.value = 0;
    transformY.value = 0;
    preTransformX.value = 0;
    preTransformY.value = 0;
    dragRect.value = { left: 0, right: 0, top: 0, bottom: 0 };
  }

  useEventListener(window, "resize", (e) => {
    reset();
  });

  return {
    isDragging,
    style,
    reset,
  };
}
