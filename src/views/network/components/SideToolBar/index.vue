<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import { cn } from "@/utils";
import equipmentPersonnelHeatMapLayer from "@/utils/WdpMap/network/EquipmentPersonnelHeatMapLayer.ts";

defineOptions({ name: "SideToolBar", inheritAttrs: false });

const { isCampus = false } = defineProps<{
  isCampus?: boolean;
}>();

const emit = defineEmits<{
  floorClick: [floor: string];
}>();

const campusId = useRouteQuery<CampusId>("campusId", CampusId.HanDan);

const checkeds = ref({
  heatMap: false,
  bi: false,
  linkPath: false,
});
function handleHeatMapChange(checked) {
  checked ? equipmentPersonnelHeatMapLayer.render(campusId.value) : equipmentPersonnelHeatMapLayer.removeAll();
}
</script>

<template>
  <div :class="cn('side-toolbar space-y-2', $attrs.class ?? '')">
    <template v-if="isCampus">
      <ToolbarCheckboxItem v-model="checkeds.heatMap" icon="i-svg-network-hotmap" label="热力图" @change="handleHeatMapChange" />
    </template>

    <LargeScreenPreview
      screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/37bb5db2aa9e4f2b9f5ef59eacfbd310/view?entryType=7"
      screen-title="BI详表" @close="checkeds.bi = false">
      <template #trigger>
        <ToolbarCheckboxItem v-model="checkeds.bi" icon="i-svg-network-bi" label="BI详表" />
      </template>
    </LargeScreenPreview>

    <ToolbarCheckboxItem v-if="isCampus" v-model="checkeds.linkPath" icon="i-svg-network-link-path" label="链路" />
  </div>
</template>

<style scoped lang="scss">
.side-toolbar {
  .floor-list {
    mask: radial-gradient(circle 45px at left, transparent 0%, transparent 50%, #000000 50%, #000000 100%);
  }
}
</style>
