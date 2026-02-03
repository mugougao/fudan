<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "RepairCampusListVariant", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: any[];
}>();

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇名称", field: "name", align: "center" },
  { title: "开工时间", field: "time", align: "center", className: "text-[20px] font-number" },
];
</script>

<template>
  <div :class="cn('repair-campus-list flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="construction.repair.repairList" />
    <div class="flex-auto overflow-hidden pl-3">
      <UiEasyTable :columns="columns" :data="data" row-cell-class-name="py-0.5" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
