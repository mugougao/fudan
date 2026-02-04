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



let JiaoShiLeiXing = {
  3: [  
    { name: '小型教室', value: 150 },
    { name: '中型教室', value: 80 },
    { name: '大型教室', value: 45 }
  ],
  4: [
    { name: '小型教室', value: 160 },
    { name: '中型教室', value: 30 },
    { name: '大型教室', value: 20 }
  ]
}
let JiaoShiShuLiang = {
  3: [  
    { name: 'H1', value: 70 },
    { name: 'H2', value: 52 },
    { name: 'H3', value: 30 },
    { name: 'H4', value: 45 },
    { name: 'H5', value: 28 },
    { name: 'H6', value: 26 },
    { name: 'H7', value: 30 },
    { name: 'H8', value: 32 },
    { name: 'H9', value: 28 },
    { name: 'H10', value: 46 },
    { name: 'H11', value: 30 },
    { name: 'H12', value: 52 },
    { name: 'H13', value: 68 },
  ],
  4: [
    { name: '五教', value: 70 },
    { name: '光华楼', value: 52 },
    { name: '新闻楼', value: 30 },
    { name: 'L4', value: 45 },
    { name: '科技楼', value: 28 },
    { name: '化学楼', value: 26 },
    { name: 'L5', value: 30 },
    { name: 'L8', value: 32 },
    { name: 'U9', value: 28 },
    { name: 'M10', value: 46 },
    { name: 'H11', value: 30 },
    { name: 'H12', value: 52 },
    { name: 'H13', value: 68 },
  ]
}
let XiaoYuanGaiLan = {
  3: {jiaoxuelou: 95,jiaoshi: 1028},
  4: {jiaoxuelou: 122,jiaoshi: 1198},
}
</script>

<template>
  <UiBoxPanel
    class="row-span-18"
    :title="$t('smartsTeaching.campusOverview')"
    content-class-name="grid grid-cols-1 grid-rows-24 px-3">
    <div class="count-box row-span-4 flex">
      <UiCountItem
        class="flex-1"
        icon="i-svg-icon-raw-build2" :name="$t('smartsTeaching.schoolBuilding')" :value="XiaoYuanGaiLan[campusId].jiaoxuelou" unit="栋" />
      <UiCountItem
        class="flex-1"
        icon="i-svg-icon-raw-pie" :name="$t('smartsTeaching.classroom')" :value="XiaoYuanGaiLan[campusId].jiaoshi" unit="间" type="yellow" />
    </div>
    <!--  教室类型分布  -->
    <ClassroomTypeDistribution :data="JiaoShiLeiXing[campusId]" />
    <!--  教室数量分布  -->
    <ClassroomNumberDistribution :data="JiaoShiShuLiang[campusId]" />
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.count-box {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #fff, rgba(0, 0, 0, 0)) no-repeat 48% center / 1px 30px;
}
</style>
