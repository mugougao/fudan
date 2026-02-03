<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";

defineOptions({ name: "DeviceDetailPopup" });

const { data } = defineProps<{
  data: any[];
}>();

const visible = defineModel("visible", { default: false });

const columns: IEasyTableProps["columns"] = [
  { title: "设备名称", field: "name", align: "center" },
  { title: "单位", field: "yx", align: "center" },
  {
     title: () => (
      <span>
        金额
        <span class="text-[10px] text-white/60">(万元)</span>
      </span>
    ),
    field: "je",
    align: "center",
  },
  { title: "使用方向", field: "sjfx", width: 100, align: "center" },
];
</script>

<template>
  <DragPopup
    v-model:visible="visible" title="设备分布详情" :width="400" :top="500" left="calc(100% - 1300px)"
    :auto-prev-popup="false">
    <UiEasyTable height="200px" :data="data" :columns="columns"  />
  </DragPopup>
</template>

<style scoped>

</style>
