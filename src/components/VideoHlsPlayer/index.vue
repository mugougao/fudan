<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import XGPlayer from "xgplayer";
import hlsXGPlayer from "xgplayer-hls";
import "xgplayer/dist/index.min.css";

defineOptions({ name: "VideoHlsPlayer" });
const props = withDefaults(defineProps<{ width?: string; height?: string; url: string }>(), {
  width: "100%",
  height: "100%",
});

const emit = defineEmits<{
  reloadClick: [stopSpinner: () => void];
}>();

const { width, height, url } = toRefs(props);
const sizeStyle = computed(() => ({ width: width.value, height: height.value }));

const videoPlayerRef = ref<HTMLElement>();
let player: InstanceType<typeof XGPlayer> | null;
function createPlayer() {
  player = new XGPlayer({
    el: videoPlayerRef.value,
    url: url.value,
    autoplay: true,
    volume: 0,
    loop: true,
    height: "100%",
    width: "100%",
    lang: "zh-cn",
    controls: true,
    plugins: [hlsXGPlayer],
    reloadPlugin: {
      onClick: (stopSpinner: () => void) => {
        emit("reloadClick", stopSpinner);
      },
    },
  });
}

onMounted(() => {
  createPlayer();
});
onBeforeUnmount(() => {
  player?.destroy?.();
  player = null;
});
watch(url, (value) => {
  if (!player) {
    createPlayer();
    return;
  }
  player.src = value;
});
</script>

<template>
  <div class="video-hls-player-wrapper" :style="sizeStyle">
    <div ref="videoPlayerRef" class="video-hls-player" />
  </div>
</template>

<style scoped lang="scss">
.video-hls-player-wrapper {
  .video-hls-player {
    @apply h-full w-full bg-center bg-no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%23ffffff' font-family='system-ui, sans-serif' text-anchor='middle' dominant-baseline='middle'%3E暂无视频%3C/text%3E%3C/svg%3E");
    background-size: 100% 100%;
  }
}
</style>
