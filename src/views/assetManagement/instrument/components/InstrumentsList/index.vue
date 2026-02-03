<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";

defineOptions({ name: "InstrumentsList" });

const { data } = defineProps<IProps>();
export interface IProps {
  data: { name: string; numberOfDevices: number; money: number; numberOfTerminals: number }[];
}

const columns: IEasyTableProps["columns"] = [
  { title: "院系", field: "name", align: "center" },
  {
    title: () => (
      <span class="flex flex-col">
        设备数量
        <span class="text-[10px] text-white/60">(台)</span>
      </span>
    ),
    field: "numberOfDevices",
    align: "center",
    className: "font-number text-[14px]",
  },
  {
    title: () => (
      <span class="flex flex-col">
        金额
        <span class="text-[10px] text-white/60">(万元)</span>
      </span>
    ),
    field: "money",
    align: "center",
    className: "font-number text-[14px]",
  },
  {
    title: () => (
      <span class="flex flex-col">
        终端数量
        <span class="text-[10px] text-white/60">(台)</span>
      </span>
    ),
    field: "numberOfTerminals",
    align: "center",
    className: "font-number text-[14px]",
  },
];

const state = computed(() => {
  return (data || [])
    .map((item, index) => ({
      id: index,
      ...item,
    }))
    .sort((a, b) => b.numberOfDevices - a.numberOfDevices);
});
</script>

<template>
  <div class="flex-auto overflow-hidden">
    <UiEasyTable :columns="columns" :data="state" first-column-type="build" />
  </div>
</template>
