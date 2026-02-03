<script setup lang="tsx">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";
import to from "await-to-js";
import Decimal from "decimal.js";
import { fetchBuildingAssetsDetail } from "@/api/network/campus.ts";
import { cn } from "@/utils";

defineOptions({ name: "NetworkDevicePopup", inheritAttrs: false });

const { id } = defineProps<{
  id: string;
}>();

const visible = defineModel<boolean>("visible", { default: false });

const {
  state,
  execute,
} = useAsyncState(
  async () => {
    const [,res] = await to(fetchBuildingAssetsDetail(id));
    return res?.resultData || {};
  },
  {},
  { immediate: false, resetOnExecute: false },
);

watch(
  () => [visible.value, id],
  ([visible, id]) => {
    if (visible && id) execute();
  },
);

const columns: IDescriptionsProps["columns"] = [
  { label: "工作时长", field: "time", render: ({ value }) => `${new Decimal(value || 0).times(60).toString()}分钟` },
  { label: "MAC地址", field: "mac" },
  { label: "连接终端/人数", field: "zd/yh", render: () => (<span class="text-[#E6F5FA]">{`${state.value?.zd || 0}/${state.value?.yh || 0}`}</span>) },
  { label: "设备健康度", field: "ap_health", render: () => {
    const value = state.value?.ap_health || "LOW";
    const { text = "低", className = "text-[#FFBF51] border-[#FFBF51] bg-[#FFBF51]/10" } = {
      HIGH: { text: "高", className: "text-[#40FF9C] border-[#40FF9C] bg-[#40FF9C]/10" },
      MEDIUM: { text: "中", className: "text-[#F9FB77] border-[#F9FB77] bg-[#F9FB77]/10" },
      LOW: { text: "低", className: "text-[#FFBF51] border-[#FFBF51] bg-[#FFBF51]/10" },
    }[value] || {};
    return (
      <span
        class={cn(
          "inline-flex items-center justify-center leading-none border rounded-full px-1 py-0.5 text-[12px] leading-none",
          className,
        )}
      >
        健康度 :
        <span>{text}</span>
      </span>
    );
  } },
];

const popupRef = useTemplateRef("popup");
defineExpose({
  setPosition: (top: number | string, left: number | string) => popupRef.value?.setPosition(top, left),
});
</script>

<template>
  <DragPopup ref="popup" v-model:visible="visible" :width="300" :left="400" :top="300">
    <template #title>
      <span class="text-[12px]">{{ id }}</span>
      <span
        :class="cn(
          'border rounded-full text-[12px] leading-none py-0.5 font-text-medium px-1 ml-2 inline-flex items-center justify-center',
          state?.status === 'RUNNING'
            ? 'border-[#83F4C2] bg-[#83F4C2]/10 text-[#83F4C2]'
            : 'border-[#969696] bg-[#969696]/10 text-[#969696]')">
        {{ state?.status === "RUNNING" ? "在线" : "离线" }}
      </span>
    </template>
    <EmptyWrapper :is-empty="!state">
      <Descriptions
        :columns="columns" :data="state"
        class="mt-2 space-y-1"
        label-class-name="font-text-medium"
        content-class-name="font-number" />
    </EmptyWrapper>
  </DragPopup>
</template>

<style scoped lang="scss">
</style>
