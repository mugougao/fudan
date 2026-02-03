<script setup lang="ts">
import { useScaleScreen } from "@/hooks";
import { themeRed } from "@/plugins/antd/theme.ts";
import { useCampusStore } from "@/stores/campus";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import FooterNav from "./components/FooterNav/index.vue";
import HeaderNav from "./components/HeaderNav/index.vue";
import Render from "./components/Render/index.vue";

defineOptions({ name: "LayoutWdp" });

const router = useRouter();
const route = useRoute();

const scaleScreenElement = useTemplateRef<HTMLElement>("scaleScreen");
provide("scaleScreen", scaleScreenElement);

const { style, unScale, scale } = useScaleScreen({ width: 1920, height: 1080 }, true);
provide("unScale", unScale);
provide("scale", scale);
const popupContainer = useTemplateRef("popupContainer");
onMounted(() => {
  document.body.classList.add("overflow-hidden");
});
onBeforeUnmount(() => {
  document.body.classList.remove("overflow-hidden");
});

const campusMounted = ref(false);
function onShowCampusChange() {
  if (route.meta?.showCampus) {
    campusPoiLayer.showAll();
    campusRangeLayer.showAll();
    return;
  }
  campusPoiLayer.hideAll();
  campusRangeLayer.hideAll();
}

onMounted(async () => {
  wdpMap.addLayer(campusPoiLayer, campusRangeLayer);
  wdpMap.onCreated(() => {
    campusRangeLayer.focusByCampusId();
    campusMounted.value = true;
    onShowCampusChange();
  });
});

onBeforeUnmount(() => {
  campusMounted.value = false;
});

watch(
  () => route.meta?.showCampus,
  () => onShowCampusChange(),
);

const campusStore = useCampusStore();

function onCampusClick({ id }) {
  campusStore.setActiveCampusId(id);
}

campusPoiLayer.onClick(onCampusClick);
campusRangeLayer.onClick(onCampusClick);

function getPopupContainer() {
  return popupContainer.value ?? document.body;
}

watch(
  () => route.meta?.showCampus,
  () => onShowCampusChange(),
  // { immediate: true },
);

watch(
  () => [campusStore.activeCampusId, campusMounted.value] as [string, boolean],
  async () => {
    await nextTick();
    if (!campusMounted.value) return;
    campusRangeLayer.focusByCampusId(campusStore.activeCampusId);
  },
  { immediate: true },
);
</script>

<template>
  <AConfigProvider :theme="themeRed" :get-popup-container="getPopupContainer">
    <div class="layout-default-wrapper relative h-screen w-full overflow-hidden bg-gray-900">
      <div class="layout-default-map absolute inset-0 wh-full overflow-hidden">
        <Render />
      </div>
      <div
        ref="scaleScreen" :style="style"
        class="layout-default-container pointer-events-none absolute top-0">
        <HeaderNav />
        <RouterView v-slot="{ Component }">
          <Transition mode="out-in" :duration="1000">
            <div :key="$route.name" class="wh-full">
              <Component :is="Component" />
            </div>
          </Transition>
        </RouterView>
        <FooterNav />

        <div id="antd-vue-dropdown-container" ref="popupContainer" :style="{ '--scale': scale, '--unScale': unScale }" />
      </div>
    </div>
  </AConfigProvider>
</template>

<style scoped lang="scss">
div.layout-default-wrapper {
  color: #fff;
  & > div.layout-default-map {
    background: url("@/assets/images/bg2.jpg") no-repeat center;
    background-size: 100% 100%;
  }
  & > .layout-default-container {
    background: url("@/assets/images/bgMask1.png") no-repeat center bottom;
    background-size: 100% calc(100% - 35px);
  }
}
</style>

<style lang="scss">
#antd-vue-dropdown-container {
  @apply absolute top-0 left-0 z-[999999] scale-[var(--unScale)] pointer-events-none;
  .ant-select-dropdown,
  .ant-picker-dropdown {
    @apply pointer-events-auto;
    transform: scaleX(var(--scale)) scaleY(var(--scale)) !important;
  }
}
</style>
