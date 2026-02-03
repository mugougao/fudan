<script setup lang="ts">
defineOptions({ name: "RepairInfo" });

// ==================== 物业数据大屏 =====================
const fullscreenTargetRef = useTemplateRef<HTMLDivElement>("fullscreenTarget");
const { isFullscreen, toggle } = useFullscreen(fullscreenTargetRef);
// ==================== 物业数据大屏 =====================
</script>

<template>
  <UiBoxPanel
    class="row-span-7" title-path="dormitory.campus.largePropertyDataScreen"
    content-class-name="flex flex-col">
    <!-- <template #extra>
      <button type="button" class="flex-center rounded bg-transparent wh-30px hover:bg-white/10" @click="toggle">
        <i :class="[isFullscreen ? 'i-ri-fullscreen-exit-line' : 'i-ri-fullscreen-line']" />
      </button>
    </template> -->
    <LargeScreenPreview
      class="h-full w-full"
      screen-url="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6MzAzMzUwOX0="
      screen-title="物业数据大屏">
      <template #trigger>
        <div class="group relative h-full w-full px-2">
          <div class="aspect-video w-full">
            <iframe src="https://workspace.easyv.cloud/shareScreen/eyJzY3JlZW5JZCI6MzAzMzUwOX0=" width="100%" height="100%" />
          </div>
          <div class="invisible absolute inset-0 h-full w-full flex items-center justify-center bg-gray-900/50 group-hover:visible">
            <i class="i-ri-eye-line" />
          </div>
        </div>
      </template>
    </LargeScreenPreview>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count {
  background:
    url("@/assets/images/lifeServices/campus/RepairInfoIcon.png") no-repeat 18px center / 30px 30px,
    url("@/assets/images/lifeServices/campus/RepairInfoBg.png") no-repeat center / 100% 100%;
}
</style>
