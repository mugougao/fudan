<script setup lang="ts">
import round from "lodash/round";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "AssetLargeInstruments", inheritAttrs: false });

const { chargeData = [50, 50] } = defineProps<{
  chargeData?: [number, number];
}>();

const total = computed(() => chargeData[0] + chargeData[1]);

const percents = computed(() => {
  const [outside] = chargeData;
  if (total.value === 0) return { outside: 0, inside: 0 };
  const outsidePercent = total.value === 0 ? 0 : round(outside / total.value * 100);
  return {
    outside: outsidePercent,
    inside: 100 - outsidePercent,
  };
});
</script>

<template>
  <div :class="cn('asset-large-instruments flex flex-col overflow-hidden', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.largeInstruments" class="shrink-0" />
    <div class="chart-box flex flex-auto items-center">
      <div class="ml-[22px] size-[110px] flex flex-col items-center justify-center text-[12px] children:leading-none">
        <span class="mb-1 text-[22px] font-number">{{ numberToThousands(total) }} </span>
        <span class="text-white/60">(万元)</span>
        <i class="i-ri-arrow-up-s-fill" />
        <span>总收费金额</span>
      </div>

      <div class="ml-2 flex flex-col flex-auto gap-y-1 overflow-hidden px-4">
        <span class="flex items-center justify-between text-[12px]">
          <span class="inline-flex items-center gap-1">
            <span class="inline-block size-[6px] border border-[#C8C8C8] from-white/12 to-white/60 bg-gradient-to-r" />
            {{ $t('financial.index.internalCharge') }}
          </span>
          <span class="inline-flex items-center gap-1">
            {{ $t('financial.index.externalCharge') }}
            <span class="inline-block size-[6px] border border-[#CE7A7A] from-[#CC1A1A]/80 to-[#CC1A1A]/12 bg-gradient-to-r" />
          </span>
        </span>
        <span class="w-full flex justify-between text-[10px] children:leading-[10px]">
          <span :style="`width:${percents.outside}%;`" class="h-[12px] border border-[#C8C8C8] from-white/12 to-white/60 bg-gradient-to-r text-left text-white">{{ percents.outside }}%</span>
          <span :style="`width:${percents.inside}%;`" class="h-[12px] border border-[#CE7A7A] from-[#CC1A1A]/80 to-[#CC1A1A]/12 bg-gradient-to-r text-right text-[#FDDFDF]">{{ percents.inside }}%</span>
        </span>
        <span class="flex justify-between">
          <span class="text-[10px] text-white/80"><span class="text-base text-white font-number">{{ numberToThousands(chargeData[0]) }}</span>万元</span>
          <span class="text-[10px] text-white/80"><span class="from-[#D45F5F] to-white bg-gradient-to-b bg-clip-text text-base text-transparent font-number">{{ numberToThousands(chargeData[1]) }}</span>万元</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  height: 130px;
  background: url("@/assets/images_new/count-bg-4.png") no-repeat center calc(100% - 0px) / 342px 132px;
}
</style>
