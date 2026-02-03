<script setup lang="ts">
import type { Ref, ShallowRef } from "vue";
import { useDragPopup } from "@/hooks";
import { numberToCss } from "@/utils";

defineOptions({ name: "MapPopup" });

const { title, width = 520, top = 50, left = "center", showClose = true } = defineProps<{
  title?: string;
  width?: string | number;
  top?: string | number;
  left?: string | number;
  showClose?: boolean;
}>();
const emit = defineEmits<{
  close: [];
}>();

const scaleScreen = inject<ShallowRef<HTMLElement | null | undefined >>("scaleScreen");
const scale = inject<Ref<number>>("scale");

const visible = defineModel<boolean>("visible", { default: false });

function handleClose() {
  visible.value = false;
  emit("close");
}

const targetElement = useTemplateRef<HTMLElement>("target");
const handleElement = useTemplateRef<HTMLElement>("handle");
const containerElement = computed(() => toValue(scaleScreen) || document.body);
const { style: dragPopupStyle, isDragging } = useDragPopup({ targetElement, handleElement, containerElement, scale });

const dragPopupContainerStyle = computed(() => {
  const result = { "width": numberToCss(width), "marginTop": numberToCss(top), ...dragPopupStyle.value, "--animate-duration": "0.3s" };
  Object.assign(result, left === "auto" ? { marginLeft: "auto", marginRight: "auto" } : { marginLeft: numberToCss(left) });
  return result;
});
</script>

<template>
  <teleport :to="containerElement">
    <div class="drag-popup-wrapper h-full w-full" :class="[isDragging ? 'pointer-events-auto' : 'pointer-events-none']">
      <Transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut">
        <div v-show="visible" ref="target" class="drag-popup-container pointer-events-auto relative" :style="dragPopupContainerStyle">
          <BorderBox :width="width">
            <header ref="handle" class="drag-popup-header cursor-move pb-5px pl-30px pr-60px pt-15px text-20px text-white font-bold tracking-widest">
              <slot name="title">
                <span class="drag-popup-title">{{ title }} </span>
              </slot>
            </header>
            <button
              v-if="showClose"
              class="drag-popup-close absolute right-5 top-2 bg-transparent text-xl text-white"
              @click="handleClose">
              <i class="i-ri-close-large-line" />
            </button>
            <main class="drag-popup-body px-20px pb-20px pt-5px">
              <slot />
            </main>
          </BorderBox>
        </div>
      </Transition>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.drag-popup-wrapper {
  @apply absolute left-0 right-0 top-0 z-9999 w-full;
}
</style>
