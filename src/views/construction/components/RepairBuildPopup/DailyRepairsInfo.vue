<script setup lang="ts">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";

defineOptions({ name: "DailyRepairsInfo", inheritAttrs: false });

const { data } = defineProps<{
  data: any;
}>();

const columns: IDescriptionsProps["columns"] = [
  { label: "项目名称", field: "项目名称" },
  { label: "申请单位", field: "申请单位", render: ({ value }) => value ?? "总务处" },
  { label: "立项编号", field: "立项编号" },
  { label: "立项金额", field: "立项金额（万元）", render: ({ value }) => `${value ?? 0}万元` },
  { label: "施工单位", field: "施工单位" },
  { label: "修缮部位", field: "修缮部位" },
  {
    label: "主要工作报告",
    field: "主要工作内容",
    // className: "col-span-full flex-wrap",
    // labelClassName: "w-full text-left",
    // contentClassName: "bg-[#5B5B5B]/40 text-[#FFF6F6] text-[14px] w-full p-2 rounded backdrop-blur-sm h-[100px] overflow-y-auto mt-1",
  },
  { label: "开工时间", field: "开工时间" },
  { label: "竣工时间", field: "竣工时间" },
];
</script>

<template>
  <div>
    <Descriptions
      :columns="columns" :data="data"
      label-class-name="text-[14px]"
      content-class-name="text-[14px]"
      item-class-name="mb-2" />
  </div>
</template>

<style scoped lang="scss">

</style>
