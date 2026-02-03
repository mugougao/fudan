<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";

defineOptions({ name: "DeviceDistribution" });

const { data } = defineProps<{
  data: any[];
}>();

const columns: IEasyTableProps["columns"] = [
  { title: "学院名称", field: "name", align: "center", ellipsis: true },
  {
    title: () => (
      <span>
        设备数量
        <span class="text-[10px] text-white/60">(台)</span>
      </span>
    ),
    field: "value",
    align: "center",
    className:'font-number text-[14px]'
  },
  {
     title: () => (
      <span>
        金额
        <span class="text-[10px] text-white/60">(万元)</span>
      </span>
    ),
    field: "value1",
    align: "center",
    className:'font-number text-[14px]'
  },
];

 
</script>

<template>
  <div class="device-distribution h-160px mt-2">
    <UiEasyTable :data="data" :columns="columns"  />
  </div>
</template>

<style scoped lang="scss">
</style>
