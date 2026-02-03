<script setup lang="tsx">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "BaseInfoList", inheritAttrs: false });

const columns: IDescriptionsProps["columns"] = [
  { label: "项目名称", field: "projectName", className: "col-span-full", contentClassName: "font-text-medium bg-gradient-to-t from-red/80 from-10% to-white bg-clip-text text-transparent" },
  { label: "用地范围", field: "landUseScope", className: "col-span-full", contentClassName: "font-text-medium bg-gradient-to-t from-red/80 from-10% to-white bg-clip-text text-transparent" },
  { label: "开工日期", field: "startDate", contentClassName: "text-[16px] leading-none font-number font-text-medium bg-gradient-to-b from-red from-10% to-white bg-clip-text text-transparent" },
  { label: "计划建成日期", field: "plannedCompletionDate", contentClassName: "text-[16px] leading-none font-number font-text-medium bg-gradient-to-b from-red from-10% to-white bg-clip-text text-transparent" },
  {
    label: "总投资",
    field: "totalInvestment",
    contentClassName: "text-[16px] leading-none font-number",
    render: ({ value }) => (
      <span>
        <span class="from-red/80 to-white from-10% bg-gradient-to-t bg-clip-text text-transparent font-number">{value}</span>
        <span class="text-[12px] text-white/60 font-text">万元</span>
      </span>
    ),
  },
  {
    label: "建筑总高度",
    field: "totalBuildingHeight",
    contentClassName: "text-[16px] leading-none font-number",
    render: ({ value }) => (
      <span>
        <span class="from-red/80 to-white from-10% bg-gradient-to-t bg-clip-text text-transparent font-number">{value}</span>
        <span class="text-[12px] text-white/60 font-text">m</span>
      </span>
    ),
  },
];
const data = {
  projectName: "复旦大学江湾校区融合创新二号楼",
  landUseScope: "学校江湾校区内，东至经二路、南至规划新建楼宇、西至经一路、北至纬五河",
  startDate: "2023/9/1",
  plannedCompletionDate: "——",
  totalInvestment: "40000",
  totalBuildingHeight: "42",
};
</script>

<template>
  <div :class="cn('base-info-list', $attrs.class ?? '')">
    <Descriptions
      :columns="columns" :data="data"
      class="grid grid-cols-2 gap-y-1"
      item-class-name="text-[14px]"
      label-class-name="text-white/60" />
  </div>
</template>

<style scoped lang="scss">

</style>
