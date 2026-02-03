<script setup lang="ts">
import imageSrc from "@/assets/images/biBigScreen.png";

defineOptions({ name: "BiBigScreen", inheritAttrs: false });
</script>

<template>
  <UiBoxPanel :title="$t('assetMgr.biBigScreen')" class="row-span-7">
    <LargeScreenPreview
      :preview-image-src="imageSrc"
      :screen-title="$t('assetMgr.biBigScreen')"
      screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/c6cb731d03f8418b94f233c8c6958108/view?entryType=7" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
