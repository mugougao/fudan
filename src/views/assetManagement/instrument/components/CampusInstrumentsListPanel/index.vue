<script setup lang="ts">
import campusWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/instrument/CampusWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";
import FacultiesQuery, { type IProps as IFacultiesQueryProps } from "../FacultiesQuery/index.vue";
import InstrumentsList, { type IProps as IInstrumentsListProps } from "../InstrumentsList/index.vue";

defineOptions({ name: "CampusInstrumentsListPanel" });
const { instrumentsListData, facultiesQueryData } = defineProps<{
  instrumentsListData: IInstrumentsListProps["data"];
  facultiesQueryData: IFacultiesQueryProps["data"];
}>();

const emit = defineEmits<{
  facultiesQuerySearch: [text: string];
}>();

async function handleCampusChange(params: { checked: boolean;campus: string;college: string }) {
  const { checked, campus, college } = params;
  await campusWithCollegePoiLayer.removeAll();
  if (!checked) {
    await campusPoiLayer.showAll();
    return;
  }
  await campusPoiLayer.hideAll();
  await campusWithCollegePoiLayer.renderCampusWithCollege(campus, college);
}
</script>

<template>
  <UiBoxPanel class="row-span-17 space-y-2" title-path="largeInstruments.facultiesLargeInstrumentsList" content-class-name="flex flex-col">
    <InstrumentsList :data="instrumentsListData" />
    <!--  院系查询  -->
    <FacultiesQuery :data="facultiesQueryData" @search="(text) => emit('facultiesQuerySearch', text)" @campus-change="handleCampusChange" />
  </UiBoxPanel>
</template>

<style scoped>

</style>
