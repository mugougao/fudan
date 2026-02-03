<script setup lang="tsx">
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "DeviceUseInfo", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: any;
}>();

const columns: { label: string; field: string; unit: string; children: { label: string; field: string; icon: string; unit: string; type: string }[] }[] = [
  {
    label: "使用时长",
    field: "syzxs",
    unit: "小时",
    children: [
      { label: "校内使用", field: "xnsysc", unit: "小时", icon: "i-svg-reset-research-duration", type: "内" },
      { label: "校外使用", field: "xWsysc", unit: "小时", icon: "i-svg-reset-research-duration", type: "外" },
    ],
  },
  {
    label: "预约次数",
    field: "zyycs",
    unit: "次",
    children: [
      { label: "校内预约", field: "xnycs", unit: "次", icon: "i-svg-reset-research-appointment", type: "内" },
      { label: "校外预约", field: "xwyycs", unit: "次", icon: "i-svg-reset-research-appointment", type: "外" },
    ],
  },
  {
    label: "收费金额",
    field: "zsfje",
    unit: "元",
    children: [
      { label: "校内收费", field: "xnsfje", unit: "元", icon: "i-svg-reset-research-fees", type: "内" },
      { label: "校外收费", field: "xwsfje", unit: "元", icon: "i-svg-reset-research-fees", type: "外" },
    ],
  },
] as { label: string; field: string; unit: string; children: { label: string; field: string; icon: string; unit: string; type: string }[] }[];
</script>

<template>
  <div :class="cn('device-use-info h-full flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title="仪器使用情况" class="mb-2 shrink-0" />
    <div class="flex flex-col gap-3">
      <div
        v-for="({ label, field, unit, children }) in columns" :key="field"
        class="flex items-center">
        <div class="dot-border h-[80px] w-[100px] shrink-0 p-1.5">
          <div class="h-full w-full flex flex-col items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[#FFE5E5]">
            <i class="i-svg-icon-device shrink-0 text-xl" />
            <span class="text-[14px] font-number">{{ get(data, field, 0) }}<span class="text-[12px]">{{ unit }}</span></span>
            <span class="text-[10px] font-title">{{ label }}</span>
          </div>
        </div>

        <div class="dot-border ml-2 h-[80px] flex-auto overflow-hidden">
          <div class="content-box flex items-center p-1.5 px-3">
            <span
              v-for="(child, index) in children" :key="child.field"
              class="flex flex-col flex-1 items-center">
              <span
                :class="index % 2 ? 'from-[#F7C998]' : 'from-red'"
                class="to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-text-bold">{{ child.label }}</span>
              <span class="text-[20px] font-number">{{ get(data, child.field, 0) }}</span>
              <span class="text-[10px] text-[#9E9E9E]">({{ child.unit }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-box {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat center / 1px 80%;
}
</style>
