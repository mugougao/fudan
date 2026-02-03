<script setup lang="tsx">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";
import Descriptions from "@/components/Descriptions/index.vue";

defineOptions({ name: "LargeScaleRepairs", inheritAttrs: false });

const { data } = defineProps<{
  data: any;
}>();

function ViewBtn() {
  return (
    <button class="rounded-md bg-transparent text-[#FFB96E]">
      点击查看
    </button>
  );
}

const columns: IDescriptionsProps["columns"] = [
  { label: "项目名称", field: "项目名称", className: "col-span-full" },
  {
    label: "立项批复",
    field: "projectApproval",
    render: () => {
      return (<ViewBtn />);
    },
  },
  {
    label: "施工许可",
    field: "constructionPermits",
    render: () => {
      return (<ViewBtn />);
    },
  },

  { label: "计划开工时间", field: "开工时间" },
  { label: "计划竣工时间", field: "竣工时间" },
  { label: "实际开工时间", field: "开工时间" },
  { label: "实际竣工时间", field: "竣工时间" },

  { label: "施工单位", field: "施工单位" },
  { label: "设计单位", field: "设计单位" },
  { label: "监理单位", field: "监理单位" },

  {
    label: "竣工验收合格证",
    field: "completionAcceptanceCertificate",
    render: () => {
      return (<ViewBtn />);
    },
  },

];

function CustomDescriptions({ columns, data }: { columns: IDescriptionsProps["columns"];data: IDescriptionsProps["data"] }) {
  return (
    <div class="px-2">
      <Descriptions
        columns={columns}
        data={data}
        class="grid grid-cols-12 gap-y-2 text-[14px] text-white font-text-medium"
        label-class-name="text-right text-[14px] text-white font-text-medium"
        item-class-name="col-span-6"
      />
    </div>
  );
}
</script>

<template>
  <div class="space-y-2">
    <Descriptions
      :columns="columns" :data="data"
      label-class-name="text-[14px]"
      content-class-name="text-[14px]"
      item-class-name="mb-2" />
  </div>
</template>

<style scoped lang="scss">

</style>
