<script setup lang="ts">
defineOptions({ name: "ViewPanelController" });

const emit = defineEmits<{
  showBuildPoiChange: [show: boolean];
  showDataPanelChange: [show: boolean];
}>();

// 展开
const collapsed = ref(false);
// 显示/隐藏 楼东标签
const showBuildPoi = ref(true);
// 显示/隐藏 数据面板
const showDataPanel = ref(true);

let timeoutId: number | null = null;
function handleMouseleave() {
  timeoutId = setTimeout(() => {
    collapsed.value = false;
  }, 5000);
}
function handleMouseover() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function handleShowBuildPoiChange(event) {
  const target = event.target as HTMLInputElement;
  emit("showBuildPoiChange", target.checked);
}
function handleShowDataPanelChange(event) {
  const target = event.target as HTMLInputElement;
  emit("showDataPanelChange", target.checked);
}
</script>

<template>
  <div
    class="view-panel-controller absolute right-5 top-0 z-9999 inline-block flex select-none items-center"
    @mouseover="handleMouseover" @mouseleave="handleMouseleave">
    <button type="button" class="view-panel-controller-trigger" @click="collapsed = !collapsed">
      <img src="@/assets/images/commons/controllerTrigger.png" alt="trigger" class="wh-24px">
    </button>
    <div
      class="view-panel-controller-content order-first w-0px overflow-hidden whitespace-nowrap transition-all"
      :class="collapsed ? 'w-186px' : 'w-0'">
      <label class="cursor-pointer">
        <input v-model="showBuildPoi" type="checkbox" name="showBuildPoi" class="hidden" @change="handleShowBuildPoiChange">
        <i v-show="showBuildPoi" class="i-ri-eye-line text-#FA7D39" />
        <i v-show="!showBuildPoi" class="i-ri-eye-off-line" />
        <GradientText :deg="0" :colors="{ 0: '#fff', 100: showBuildPoi ? '#FA7D39' : '#fff' }">楼栋名称</GradientText>
      </label>
      <label class="cursor-pointer">
        <input v-model="showDataPanel" type="checkbox" name="showDataPanel" class="hidden" @change="handleShowDataPanelChange">
        <i v-show="showDataPanel" class="i-ri-eye-line text-#FA7D39" />
        <i v-show="!showDataPanel" class="i-ri-eye-off-line" />
        <GradientText :deg="0" :colors="{ 0: '#fff', 100: showDataPanel ? '#FA7D39' : '#fff' }">数据面板</GradientText>
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-panel-controller {
  .view-panel-controller-trigger {
    @apply relative flex-center wh-46px rounded-full bg-#8D594E/40 backdrop-blur shadow-[inset_0px_0px_20px_0px_#FA5B39];
    &:after,
    &:before {
      content: "";
      @apply absolute inset-0 wh-full rounded-full border;
    }
    &:before {
      @apply border-#AD3B3B;
    }
    &:after {
      @apply border-#FF7D7D;
      mask: linear-gradient(to bottom, #000 0%, transparent 100%);
    }
  }
  .view-panel-controller-content {
    @apply h-47px -mr-22px flex items-stretch gap-2px;
    & > label {
      @apply flex flex-col gap-2px items-center justify-center bg-#6A3B32 text-12px;
      & > i {
        @apply text-14px;
      }
      &:first-child {
        @apply rounded-l-full w-80px;
      }
      &:last-child {
        @apply relative w-80px;
        &:after {
          content: "";
          @apply absolute top-0 left-full;
          width: 24px;
          height: 47px;
          background-image: radial-gradient(
            circle at right center,
            transparent 0%,
            transparent 70%,
            #6a3b32 70%,
            #6a3b32 100%
          );
          background-size: 23.5px 47px;
        }
      }
    }
  }
}
</style>
