<script setup lang="tsx">
import UiSwitch from "@/components/ui/Switch/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "ChannelInfo", inheritAttrs: false });

const floor = ref("4");
const floorList = [
  { label: "4F", value: "4" },
  { label: "3F", value: "3" },
  { label: "2F", value: "2" },
  { label: "1F", value: "1" },
];
function AccidentSiteInfoItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div class="dot-border flex items-center justify-between px-2 py-2">
      <span class="text-[14px]">
        {label}
      </span>
      <UiSwitch modelValue={value} />
    </div>
  );
}
</script>

<template>
  <div class="personnel-info">
    <div class="h-[100px] px-2 py-2 text-[14px] space-y-2">
      <div class="flex items-center">
        <span class="shrink-0">出入口总数</span>
        <input type="text" class="ml-auto mr-2 h-[30px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-2 text-[12px] text-white">
        <span>个</span>
      </div>
      <div class="flex items-center">
        <span class="shrink-0">关闭出入口</span>
        <input type="text" class="ml-auto mr-2 h-[30px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-2 text-[12px] text-white">
        <span>个</span>
      </div>
    </div>

    <div class="flex gap-2">
      <ul class="border border-[#FFF3F3]/20 bg-[#000A17]/20 p-2 space-y-2">
        <li
          v-for="item in floorList" :key="item.value"
          :class="cn(
            'h-[30px] w-[36px] flex items-center justify-center border',
            floor === item.value ? 'border-[#CC1A1A] bg-gradient-to-b from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75%' : 'border-[#9E9E9E]',
          )"
          @click="floor = item.value">
          <span>{{ item.label }}</span>
        </li>
      </ul>

      <div class="flex-auto space-y-2">
        <AccidentSiteInfoItem v-for="i in 4" :key="i" :label="`出入口${i}`" :value="Boolean(i % 2)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
