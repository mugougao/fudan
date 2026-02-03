<script setup lang="ts">
import { useState } from "@/hooks";
import ViewPanelController from "./ViewPanelController/index.vue";

defineOptions({ name: "ViewPanel", inheritAttrs: false });

const { leftGrid = true, rightGrid = true, showReturn = false, onCustomReturn, showTools = true, defaultShowDataPanel = true } = defineProps<{
  leftGrid?: boolean;
  rightGrid?: boolean;
  showReturn?: boolean;
  onCustomReturn?: (e: CustomEvent) => void;
  showTools?: boolean;
  defaultShowDataPanel?: boolean;
}>();

const emit = defineEmits<{
  showBuildPoiChange: [show: boolean];
}>();

const router = useRouter();

// 返回
function returnHandler(e) {
  if (onCustomReturn) {
    onCustomReturn(e);
    return;
  }
  router.back();
}
// 离开页面中，用于处理动画
const isLeaving = ref(false);
onBeforeRouteLeave(() => {
  isLeaving.value = true;
  return true;
});

// 显示/隐藏 数据面板
const [showDataPanel, setShowDataPanel] = useState(defaultShowDataPanel);

defineExpose({
  showPanel: () => {
    setShowDataPanel(true);
  },
  hidePanel: () => {
    setShowDataPanel(false);
  },
});
</script>

<template>
  <div
    class="view-panel pointer-events-none wh-full flex flex-col pb-110px">
    <header class="relative mt-30px h-80px flex-shrink-0 children:pointer-events-auto">
      <template v-if="showReturn">
        <slot name="return" :return-handler="returnHandler">
          <button
            type="button"
            class="absolute bottom-0 right-5 flex-center rounded-xl bg-transparent px-2 py-1 text-14px text-gray-500 text-white hover:bg-gray-300/20"
            @click="returnHandler">
            <!--        <img src="@/assets/images/return-arrow.png" alt="return" class="mr-10px wh-24px"> -->
            <i class="i-ri-arrow-go-back-line mr-1" />
            <span>{{ $t('return') }}</span>
          </button>
        </slot>
      </template>

      <TransitionFadeIn>
        <slot v-if="!isLeaving && $slots.header" name="header" />
      </TransitionFadeIn>
    </header>
    <div class="flex flex-auto">
      <TransitionFadeInLeft>
        <div
          v-if="!isLeaving && $slots.left"
          class="view-panel-left relative h-full overflow-hidden transition-all children:pointer-events-auto"
          :class="showDataPanel ? 'w-350px pl-5' : 'w-0'">
          <div class="h-full w-330px" :class="leftGrid && 'grid grid-rows-24 grid-cols-1 gap-15px'">
            <slot name="left" :show-data-panel="showDataPanel" />
          </div>
        </div>
      </TransitionFadeInLeft>

      <TransitionFadeIn>
        <div v-if="!isLeaving" class="view-panel-middle relative flex-auto overflow-hidden transition-all children:pointer-events-auto">
          <slot :show-data-panel="showDataPanel" name="default" />

          <ViewPanelController
            v-if="showTools"
            @show-data-panel-change="(value) => setShowDataPanel(value)"
            @show-build-poi-change="(value) => emit('showBuildPoiChange', value)" />
        </div>
      </TransitionFadeIn>

      <TransitionFadeInRight>
        <div
          v-if="!isLeaving && $slots.right"
          class="view-panel-right h-full overflow-hidden transition-all children:pointer-events-auto"
          :class="showDataPanel ? 'w-400px pr-5' : 'w-0'">
          <div class="relative h-full w-380px" :class="rightGrid && 'grid grid-rows-24 grid-cols-1 gap-15px'">
            <slot name="right" :show-data-panel="showDataPanel" />
          </div>
        </div>
      </TransitionFadeInRight>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
