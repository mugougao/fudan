<script setup lang="tsx">
import { get } from "lodash";
import { useI18n } from "vue-i18n";
import { cn } from "@/utils";

defineOptions({ name: "CampusAssets", inheritAttrs: false });

const { data } = defineProps<{
  data: number[];
}>();
const { locale } = useI18n();
function CampusAssetsItem({ label, value, unit }: { label: string; value: string | number;unit: string }) {
  return (
    <div class="flex flex-col items-center leading-none font-title">
      <span class="text-[#BDF6FF]">
        <span class="text-[24px]">{value}</span>
        <span class="text-[14px]">{unit}</span>
      </span>
      <span class="text-[24px] en:text-[16px]">
        {label}
      </span>
    </div>
  );
}

const columns = [
  { label: "overviw.totalAssets", field: "0", unit: "万个" },
  { label: "overviw.totalAmount", field: "1", unit: "亿元" },
  { label: "overviw.totalNetValue", field: "2", unit: "亿元" },
];
</script>

<template>
  <div :class="cn('campus-assets', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.campusAssets" />
    <div class="flex items-center justify-evenly gap-2 py-3 children:flex-1">
      <div
        v-for="({ label, field, unit }) in columns" :key="field"
        class="dot-border campus-assets p-1">
        <div class="flex flex-col items-center border border-[#FFF3F3]/10">
          <span class="text-[22px] font-number">{{ get(data, field) }}</span>
          <span class="text-[12px] text-white/60">{{ unit }}</span>
          <span class="campus-assets-label inline-block w-full text-center text-[14px]">{{ $t(label) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.campus-assets-label {
  background: linear-gradient(90deg, rgba(204, 26, 26, 0.04) 0%, rgba(204, 26, 26, 0.4) 50%, rgba(204, 26, 26, 0) 100%);
  border: 1px solid;
  border-image: linear-gradient(270deg, rgba(255, 243, 243, 0) 0%, #fff3f3 49%, rgba(255, 243, 243, 0) 100%) 0.4;
}
</style>
