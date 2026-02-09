<script setup lang="ts">
import to from "await-to-js";
import { getLandmarkFileData } from "@/data/landmarkFileData";
import { useCampusStore } from "@/stores/campus.ts";
import { cn } from "@/utils";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import roamingRoutePathLayer from "@/utils/WdpMap/campusStyle/RoamingRoutePathLayer.ts";
import roamingRoutePlay from "@/utils/WdpMap/campusStyle/RoamingRoutePlay.ts";
import roamingRoutePoiLayer from "@/utils/WdpMap/campusStyle/RoamingRoutePoiLayer.ts";
import roamingRouteTextLayer from "@/utils/WdpMap/campusStyle/RoamingRouteTextLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "CampusRoamingRoutes", inheritAttrs: false });

const emit = defineEmits<{
  poiSelected: [params: { id: string; images: string[]; description: string }];
  poiUnselected: [];
}>();

const campusStore = useCampusStore();

const campusId = computed(() => campusStore.activeCampusId);

wdpMap.addLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);

onBeforeUnmount(() => {
  wdpMap.removeLayer(roamingRoutePoiLayer, roamingRoutePathLayer, roamingRouteTextLayer, roamingRoutePlay);
});

const routes = [
  // 经典打卡
  { label: "viewFuDan.classicPunchIn", key: "1", name: "经典打卡" },
  // 拥抱自然
  { label: "viewFuDan.embraceNature", key: "3", name: "拥抱自然" },
  // study Tour
  { label: "viewFuDan.studyTour", key: "2", name: "study tour" },
];
// 漫游路线点位
const routePoiList = ref<{ id: string;name: string }[]>([]);
const selectedRoutePoi = ref<string | undefined>();
const showRoutPoiListPopup = ref(false);
const showRoutPoiListLoading = ref(false);

const activeRoute = ref<string | undefined>();
async function handleChange(event: Event, name: string) {
  const target = event.target as HTMLInputElement;
  const key = target.value;
  const checked = target.checked;
  activeRoute.value = checked ? key : undefined;
  routePoiList.value = [];

  await Promise.allSettled([
    roamingRoutePlay.destroy(),
    roamingRoutePoiLayer.removeAll(),
    roamingRoutePathLayer.removeAll(),
    roamingRouteTextLayer.removeAll(),
  ]);

  if (!checked) {
    showRoutPoiListPopup.value = false;
    showRoutPoiListLoading.value = false;
    campusPoiLayer.showAll();
    campusRangeLayer.focusByCampusId(campusId.value);
    emit("poiUnselected");
    return;
  }
  try {
    showRoutPoiListPopup.value = true;
    showRoutPoiListLoading.value = true;
    campusPoiLayer.hideAll();
    await campusRangeLayer.hideAll();
    await Promise.allSettled([
      roamingRoutePoiLayer.render(key as any),
      roamingRoutePathLayer.render(key as any),
      roamingRouteTextLayer.render(key as any),
    ]);
    await campusRangeLayer.showAll();
    routePoiList.value = Array
      .from(roamingRoutePoiLayer.layerDataMap.values())
      .map(({ id, name }) => ({ id, name }));
  }
  catch (error) {
    console.error(error);
  }
  finally {
    showRoutPoiListLoading.value = false;
  }
}

async function roamingRoutePoiClick(id: string) {
  roamingRoutePlay.destroy();
  selectedRoutePoi.value = id;
  roamingRouteTextLayer.showAll();
  roamingRoutePoiLayer.hideAll();
  roamingRoutePoiLayer.focusById(id, activeRoute.value!);
  const res = getLandmarkFileData(id);
  const { resultData = {} } = res || {};
  emit("poiSelected", {
    id,
    images: resultData.fileList ?? [],
    description: resultData.jj ?? "",
  });
}
roamingRoutePoiLayer.onClick(({ id }) => roamingRoutePoiClick(id));

function onCloseRoamingRoutePoiListPopup() {
  selectedRoutePoi.value = "";
  roamingRoutePlay.destroy();
  roamingRoutePathLayer.showAll();
  roamingRouteTextLayer.showAll();
  roamingRoutePoiLayer.showAll();
  roamingRoutePathLayer.fly();
}
</script>

<template>
  <div :class="cn('campus-roaming-routes', $attrs.class ?? '')">
    <UiSubTitle  title="漫游路线"/>
    <div class="mt-3 flex items-center gap-x-3 px-3 children:flex-1">
      <label
        v-for="{ label, key, name } in routes" :key="key"
        :class="cn(
          'px-3 relative cursor-pointer whitespace-nowrap flex-1 text-center py-0.5',
          'border border-white/60',
          'bg-gradient-to-b from-white/10 via-white/30 to-transparent',
          'text-[16px] text-white/60 text-[14px]',
          activeRoute === key && 'text-white border-[#CC1A1A] from-[#DC2F2F]/25 via-[#DC2F2F]/75 via-90%',
        )">
        <input
          type="checkbox" :checked="activeRoute === key" :value="key" name="campus-roaming-routes"
          class="hidden" @change="(event) => handleChange(event, name)">
        <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', activeRoute === key && 'bg-[#EABC8B]')" />
        <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', activeRoute === key && 'bg-[#EABC8B]')" />
        <span>{{ $t(label) }}</span>
      </label>
    </div>
    <RoamingRoutePoiListPopup
      v-model="selectedRoutePoi" v-model:visible="showRoutPoiListPopup" :data="routePoiList"
      @play="() => {
        roamingRoutePlay.play(activeRoute!);
        roamingRoutePathLayer.hideAll();
        roamingRouteTextLayer.hideAll();
        roamingRoutePoiLayer.hideAll();
      }"
      @stop="() => roamingRoutePlay.pause()"
      @change="(id) => roamingRoutePoiClick(id)"
      @close="onCloseRoamingRoutePoiListPopup" />
  </div>
</template>

<style scoped lang="scss">
.campus-roaming-routes {
  label.campus-roaming-routes-item {
    --color: #ffffff;
    background:
      linear-gradient(to right, var(--color), var(--color)) no-repeat left top / 100% 1px,
      linear-gradient(to right, var(--color), var(--color)) no-repeat left bottom / 100% 1px,
      linear-gradient(
          to bottom,
          var(--color),
          var(--color) calc(50% - 6px),
          transparent calc(50% - 6px),
          transparent calc(50% + 6px),
          var(--color) calc(50% + 6px),
          var(--color)
        )
        no-repeat left top / 1px 100%,
      linear-gradient(
          to bottom,
          var(--color),
          var(--color) calc(50% - 6px),
          transparent calc(50% - 6px),
          transparent calc(50% + 6px),
          var(--color) calc(50% + 6px),
          var(--color)
        )
        no-repeat right top / 1px 100%,
      rgba(#000, 0.4);
    color: var(--color);

    &:hover {
      --color: #29f1fa;
      color: #fff;
    }
    &:has(:checked) {
      --color: #29f1fa;
      color: var(--color);
    }
  }
}
</style>
