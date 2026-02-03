<script setup lang="ts">
import { createLoading, type ICreateLoading } from "@/utils/createLoading.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";

defineOptions({ name: "Render", inheritAttrs: false });

let loading: ICreateLoading;

onMounted(async () => {
  await nextTick();
  loading = createLoading({ tip: "地图场景加载中，请等待...", size: "large" });
  wdpMap.render("player");
  (window as any).__wdpMap__ = wdpMap;
});

onBeforeUnmount(() => {
  wdpMap.destroy();
  loading?.close();
});

wdpMap.onCreated(async (app) => {
  // 设置相机 默认角度
  await app.CameraControl.UpdateCamera({
    location: [121.50093817003349, 31.29741537805052, 229.26945738888742],
    // eslint-disable-next-line no-loss-of-precision
    rotation: { pitch: -30.75469970703125, yaw: -107.26077270507812 },
    locationLimit: [],
    pitchLimit: [-89, 0],
    yawLimit: [-180, 179.99899291992188],
    viewDistanceLimit: [1, 10000],
    controlMode: "RTS",
    fieldOfView: 90,
  });
  loading?.close();
});
wdpMap.onError(() => {
  loading?.close();
});

useEventListener(window, "resize", () => wdpMap.resize());
useEventListener(window, "beforeunload", () => wdpMap.destroy());

useEventListener(window, "contextmenu", async () => {
  if (!wdpMap.app) return;
  const { result } = await wdpMap.app.CameraControl.GetCameraInfo();
  const { location, rotation } = result;
  console.log("🚀 ~ index.vue ~ 32 ~  ~ res: ", { targetPosition: location, rotation });
});
</script>

<template>
  <div class="relative h-full w-full">
    <div id="player" class="h-full w-full" />
  </div>
</template>

<style scoped lang="scss">

</style>
