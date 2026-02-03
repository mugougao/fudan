<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import waterElectricityHeatMap from "@/utils/WdpMap/financial/WaterElectricityHeatMap";

defineOptions({ name: "EnergyToolbar", inheritAttrs: false });

const { isCampus = false } = defineProps<{
  isCampus?: boolean;
}>();

const campusId = useRouteQuery("campusId", CampusId.Overview);

const radioGroup = ref({
  bi: false,
  water: false,
  electricity: false,
});

// 热力图
async function handleChange(value: any, type: "water" | "electricity") {
  await waterElectricityHeatMap.removeAll();
  if (!value) return;
  if (type === "water") radioGroup.value.electricity = false;
  else if (type === "electricity") radioGroup.value.water = false;
  waterElectricityHeatMap.render(campusId.value, type);
}
</script>

<template>
  <div class="absolute bottom-5 left-5 flex flex-col gap-3">
    <template v-if="isCampus">
      <ToolbarCheckboxItem v-model="radioGroup.electricity" icon="i-svg-flash-circle" label="用电热力图" @change="(val) => handleChange(val, 'electricity')" />
      <ToolbarCheckboxItem v-model="radioGroup.water" icon="i-svg-flash-circle" label="用水热力图" @change="(val) => handleChange(val, 'water')" />
    </template>

    <LargeScreenPreview
      v-model="radioGroup.bi"
      screen-title="BI报表"
      screen-url="https://databi.fudan.edu.cn/decision/v5/design/report/4ed0aaba16cd43d485a2bdf10f7ad277/view?entryType=7">
      <template #trigger>
        <ToolbarCheckboxItem icon="i-svg-network-bi" value="1" label="BI报表" />
      </template>
    </LargeScreenPreview>
  </div>
</template>

<style scoped lang="scss">

</style>
