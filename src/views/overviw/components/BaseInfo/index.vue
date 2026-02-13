<script setup lang="ts">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "BaseInfo", inheritAttrs: false });

const columns = [
  { title: "overviw.campusCount", field: "campusNumber", icon: "i-svg-icon-campus", unit: "个" },
  { title: "overviw.campusArea", field: "landArea", icon: "i-svg-icon-area", unit: "万m²" },
  { title: "overviw.hospital", field: "hospital", icon: "i-svg-icon-hospital", unit: "栋" },
  { title: "overviw.libraryBook", field: "libraryBookCollection", icon: "i-svg-icon-book", unit: "万册" },
  { title: "overviw.campusPeople", field: "inSchoolPersonNumber", icon: "i-svg-icon-uear4", unit: "人" },
];

const data = {
  campusNumber: 4,
  landArea: 237.75,
  hospital: 17,
  libraryBookCollection: 591.06,
  inSchoolPersonNumber: 57149,
};
</script>

<template>
  <div :class="cn('base-info', 'flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.basicInfo" class="shrink-0">
      <template #titleSuffix>
        <HelpTipIcon tip="数据截止 2025年5月" />
      </template>
    </UiSubTitle>
    <div class="grid grid-cols-2 flex-auto gap-2 overflow-auto px-1 py-2">
      <UiCountItemBox
        v-for="{ title, field, icon, unit } in columns" :key="field"
        :name="$t(title)" value-vertical
        :value="get(data, field, 0)" :icon="icon" :unit="unit" />
    </div>
  </div>
</template>

<style scoped>

</style>
