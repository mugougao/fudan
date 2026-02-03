<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "RepairCampusList", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: any[];
}>();

const emit = defineEmits<{
  rowClick: [id: string];
}>();

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇名称", field: "name", align: "center" },
  {
    title: "修缮次数",
    field: "count",
    align: "center",
    render: ({ value }) => (
      <span>
        <span class="text-[24px] font-number">{value}</span>
        <span class="ml-0.5 text-[16px]">次</span>
      </span>
    ),
  },
];

function handleRowClick({ row: { lyid } }) {
  emit("rowClick", lyid);
}
</script>

<template>
  <div :class="cn('repair-campus-list flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="construction.repair.repairList" class="mb-1 shrink-0" />
    <div class="flex-auto overflow-hidden">
      <UiEasyTable :columns="columns" :data="data" @row-click="handleRowClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
