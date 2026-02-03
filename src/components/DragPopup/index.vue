<script setup lang="ts">
import type { Ref, ShallowRef } from "vue";
import { removeTask, runTask, setTask } from "@/components/DragPopup/closeTask.ts";
import { useDragPopup } from "@/hooks";
import { numberToCss } from "@/utils";

defineOptions({ name: "DragPopup" });

const { title, width = 520, top = 50, left = "center", showClose = true, autoPrevPopup = true } = defineProps<{
  title?: string;
  width?: string | number;
  top?: string | number;
  left?: string | number;
  showClose?: boolean;
  // 自动关闭其他弹窗
  autoPrevPopup?: boolean;
}>();
const emit = defineEmits<{
  close: [];
}>();

const scaleScreen = inject<ShallowRef<HTMLElement | null | undefined >>("scaleScreen");
const scale = inject<Ref<number>>("scale");
const dragPopupWrapperRef = useTemplateRef<HTMLElement>("dragPopupWrapperRef");
const visible = defineModel<boolean>("visible", { default: false });

watch(() => visible.value, async (val) => {
  await nextTick();
  if (val) {
    autoPrevPopup && runTask();
    setTask(handleClose);
    popupTop();
  }
  else {
    dragPopupWrapperRef.value!.style.zIndex = "999";
    autoPrevPopup && removeTask(handleClose);
  }
});

function handleClose() {
  visible.value = false;
  emit("close");
  removeTask(handleClose);
}

const targetElement = useTemplateRef<HTMLElement>("target");
const handleElement = useTemplateRef<HTMLElement>("handle");
const containerElement = computed(() => toValue(scaleScreen) || document.body);
const { reset, style: dragPopupStyle, isDragging } = useDragPopup({ targetElement, handleElement, containerElement, scale });
const position = ref({ top: numberToCss(top), left: numberToCss(left) });
function setPosition(top: number | string, left: number | string) {
  reset();
  position.value = { top: numberToCss(top), left: numberToCss(left) };
}
watch(
  () => [top, left],
  () => setPosition(top, left),
  { immediate: true, flush: "post" },
);
const dragPopupContainerStyle = computed(() => {
  const { top, left } = position.value;
  const result = { "width": numberToCss(width), "marginTop": top, ...dragPopupStyle.value, "--animate-duration": "0.3s" };
  Object.assign(result, left === "auto" ? { marginLeft: "auto", marginRight: "auto" } : { marginLeft: left });
  return result;
});

// 弹窗置顶
function popupTop() {
  if (!dragPopupWrapperRef.value) return;
  const allDragPopupWrapper = document.querySelectorAll(".drag-popup-wrapper");
  if (!allDragPopupWrapper.length) return;
  const zIndexList = [...allDragPopupWrapper].map(el => Number((el as HTMLElement).style.zIndex || 0));
  const maxZIndex = Math.max(...zIndexList);
  const currentZIndex = Number(dragPopupWrapperRef.value!.style.zIndex || 0);
  if (maxZIndex >= currentZIndex) dragPopupWrapperRef.value!.style.zIndex = String(maxZIndex + 1);
}

defineExpose({ setPosition });
</script>

<template>
  <teleport :to="containerElement">
    <div ref="dragPopupWrapperRef" class="drag-popup-wrapper h-full w-full" style="z-index: 9999;" :class="[isDragging ? 'pointer-events-auto' : 'pointer-events-none']">
      <Transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut">
        <div v-show="visible" ref="target" class="drag-popup-container pointer-events-auto relative" :style="dragPopupContainerStyle">
          <DragPopupBorder2 :width="width">
            <header
              ref="handle" class="drag-popup-header mx-4 cursor-move pb-1 pr-8 pt-2 text-base font-title"
              @mousedown="popupTop">
              <slot name="title">
                <span class="drag-popup-title">{{ title }} </span>
              </slot>
            </header>
            <button
              v-if="showClose"
              class="drag-popup-close absolute right-5 top-1 bg-transparent text-lg text-white"
              @click="handleClose">
              <i class="i-ri-close-large-line text-xs" />
            </button>
            <main class="drag-popup-body px-20px pb-20px pt-5px">
              <slot />
            </main>
          </DragPopupBorder2>
        </div>
      </Transition>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.drag-popup-wrapper {
  @apply absolute left-0 right-0 top-0 w-full;
  .drag-popup-header {
    background:
      linear-gradient(to right, #cc1a1a, #cc1a1a) no-repeat left bottom / 50px 2px,
      linear-gradient(to right, #ffffff33, #ffffff33) no-repeat 50px bottom / calc(100% - 74px) 1px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      width: 24px;
      height: 2px;
      background: linear-gradient(to right, #ffe5e5, #ffe5e5 2px, #ffffff00 2px, #ffffff00) repeat-x right bottom / 4px
        2px;
    }
  }
}
</style>
