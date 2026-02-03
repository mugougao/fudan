<script setup lang="tsx">
import type { SetupContext } from "vue";
import UiSwitch from "@/components/ui/Switch/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "SetupChannelStatus", inheritAttrs: false });

const floor = ref("4");
const floorList = [
  { label: "4F", value: "4" },
  { label: "3F", value: "3" },
  { label: "2F", value: "2" },
  { label: "1F", value: "1" },
];

const fireEscapeList = ref({
  4: [
    { id: "1", open: false },
    { id: "2", open: false },
  ],
  3: [
    { id: "1", open: false },
    { id: "2", open: false },
  ],
  2: [
    { id: "1", open: false },
    { id: "2", open: false },
  ],
  1: [
    { id: "1", open: false },
    { id: "2", open: false },
  ],
});

const floorFireEscapeList = computed({
  get: () => fireEscapeList.value[floor.value],
  set: (value) => {
    fireEscapeList.value[floor.value] = value;
  },
});

function SetupChannelStatusItem(
  { label, open }: { label: string;open: boolean },
  context: SetupContext<{
    "update:open": (open: boolean) => void;
  }>,
) {
  return (
    <div class="dot-border flex items-center justify-between px-3 py-2">
      <span>{label}</span>
      <span class="flex items-center">
        <UiSwitch modelValue={open} onUpdate:modelValue={(val: any) => context.emit("update:open", val)} />
        <span class={cn("text-[14px] ml-1", open ? "text-white" : "text-white/60")}>{open ? "开启" : "关闭"}</span>
      </span>
    </div>
  );
}
</script>

<template>
  <BoxPanel title="设置通道状态" class="row-span-10">
    <ul class="floor-box text-center">
      <li
        v-for="(item) in floorList" :key="item.value"
        class="inline-block w-[50px] cursor-pointer text-center"
        :class="floor === item.value && 'active'"
        @click="floor = item.value">
        <span>{{ item.label }}</span>
      </li>
    </ul>

    <div class="mt-2 h-[200px] overflow-y-auto space-y-2">
      <SetupChannelStatusItem
        v-for="({ id }, index) in floorFireEscapeList" :key="id"
        v-model:open="floorFireEscapeList[index].open" :label="`消防通道${index + 1}`" />
    </div>
  </BoxPanel>
</template>

<style scoped lang="scss">
.floor-box {
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  background: url("@/assets/images_new/floor-bg-mini.png") no-repeat center / 310px 36px;
  li {
    color: rgba(#ffffff, 0.6);
    font-size: 16px;
    &.active {
      color: #ffffff;
      position: relative;
      &:before,
      &::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
      }
      &:before {
        width: 30px;
        height: 5px;
        background-color: red;
        filter: blur(5px);
      }
      &::after {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 4px 4px 4px;
        border-color: transparent transparent#fff transparent;
      }
    }
  }
}
</style>
