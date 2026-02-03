<script setup lang="ts">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";

defineOptions({ name: "RepairHistoryDetailPopup", inheritAttrs: false });

const { data, title } = defineProps<{
  data: any;
  title: string;
}>();

const visible = defineModel<boolean>("visible", { default: false });

const columns: IDescriptionsProps["columns"] = [
  { label: "项目名称", field: "项目名称", className: "col-span-full" },
  { label: "申请单位", field: "申请部门", className: "col-span-full" },
  { label: "立项编号", field: "立项编号" },
  { label: "预算金额", field: "立项金额（万元）", render: ({ value }) => `${value}万元` },
  { label: "工作内容", field: "主要工作内容" },
  { label: "施工单位", field: "施工单位" },
  { label: "计划开工时间", field: "开工时间" },
  { label: "计划竣工时间", field: "竣工时间" },
  { label: "实际开工时间", field: "开工时间" },
  { label: "实际竣工时间", field: "竣工时间" },
];
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="title" :width="380" left="900px" top="380px"
    :auto-prev-popup="false">
    <Descriptions
      :columns="columns" :data="data"
      label-class-name="text-[14px]"
      content-class-name="text-[14px]"
      item-class-name="mb-2" />
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
