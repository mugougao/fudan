<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getCampusOverview } from "@/api/smartTeaching";
import { CampusId } from "@/enums";
import ClassroomNumberDistribution from "./components/ClassroomNumberDistribution/index.vue";
import ClassroomTypeDistribution from "./components/ClassroomTypeDistribution/index.vue";

// 校区ID
const campusId = useRouteQuery<string>("campusId", CampusId.HanDan) as unknown as Ref<string>;

const { state, execute } = useAsyncState(
  async () => {
    const [err, res] = await to(getCampusOverview(campusId.value));
    if (err) return { jsslfb: [], jslxfb: [], jxls: 0, jss: 0 };

    const {
      jxls = 0,
      jss = 0,
      jslxfb = [],
      jsslfb = [],
    } = res?.resultData || { jsslfb: [], jslxfb: [], jxls: 0, jss: 0 };

    return {
      buildCount: jxls,
      classRoomCount: jss,
      typeData: jslxfb.map(({ mc, num }) => ({ name: mc, value: num })),
      numberData: jsslfb.map(({ mc, num }) => ({ name: mc, value: num })),
    };
  },
  { typeData: [], numberData: [], buildCount: 0, classRoomCount: 0 },
  { immediate: true, resetOnExecute: false },
);
watch(campusId, () => execute());
</script>

<template>
  <UiBoxPanel
    class="row-span-18"
    :title="$t('smartsTeaching.campusOverview')"
    content-class-name="grid grid-cols-1 grid-rows-24 px-3">
    <div class="count-box row-span-4 flex">
      <UiCountItem
        class="flex-1"
        icon="i-svg-icon-raw-build2" :name="$t('smartsTeaching.schoolBuilding')" :value="state.buildCount" unit="栋" />
      <UiCountItem
        class="flex-1"
        icon="i-svg-icon-raw-pie" :name="$t('smartsTeaching.classroom')" :value="state.classRoomCount" unit="间" type="yellow" />
    </div>
    <!--  教室类型分布  -->
    <ClassroomTypeDistribution :data="state.typeData || []" />
    <!--  教室数量分布  -->
    <ClassroomNumberDistribution :data="state.numberData || []" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-box {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 48% center / 1px 30px;
}
</style>
