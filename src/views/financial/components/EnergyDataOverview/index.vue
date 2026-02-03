<script setup lang="tsx">
import type { FunctionalComponent } from "vue";
import get from "lodash/get";
import { useI18n } from "vue-i18n";
import HelpTipIcon from "@/components/HelpTipIcon/index.vue";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "EnergyDataOverview", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: any;
}>();

const { t } = useI18n();

const EnergyDataOverviewItem: FunctionalComponent<{
  title: string;
  tooltip: string;
  unit: string;
  value1: number;
  value2: number;
  percent: number;
}> = (props) => {
  const { title, value1, value2, percent, tooltip, unit } = props;
  const up = percent > 0;

  return (
    <section class="energy-data-overview-item flex flex-col justify-between whitespace-nowrap px-1.5">
      <header class="flex items-center justify-between py-1.5">
        <span class="energy-data-overview-item-title text-[14px] text-[#9E9E9E]">{ t(title) }</span>
        <HelpTipIcon>
          {tooltip}
        </HelpTipIcon>
      </header>
      <div class="energy-data-overview-item-value flex items-baseline justify-between">
        <span class="energy-data-overview-item-value1 text-[16px] text-white font-number">
          { numberToThousands(value1 || 0) }
          <span class="energy-data-overview-item-unit text-[12px] text-[#9E9E9E] font-text">{ unit }</span>
        </span>
        <span class="energy-data-overview-item-percent flex items-center font-number">
          <i class={cn("i-svg-icon-arrow text-[8px]", up ? "text-[#BF3F38] -scale-x-100 rotate-180" : "text-[#38BF4D]")}></i>
          <span
            class={cn(
              " to-white bg-gradient-to-b bg-clip-text text-[14px] text-transparent",
              up ? "from-[#D45F5F]" : "from-[#7FC7A7]",
            )}
          >
            { percent || 0 }
            %
          </span>
        </span>
      </div>
      <footer class="energy-data-overview-item-footer h-[30px] flex items-baseline pt-1">
        <span class="energy-data-overview-item-value2 text-[18px] text-white font-number">{ numberToThousands(value2 || 0) }</span>
        <span class="ml-0.5 text-[12px] text-[#C6C6C6]">万元</span>
      </footer>
    </section>
  );
};

const columns = [
  { title: "financial.energy.yesterdayEnergy", fields: ["nowelect", "nowelectamount", "nowelectmom"], tooltip: "日环比增长率", unit: "万Kwh" },
  { title: "financial.energy.thisMonthEnergy", fields: ["monthelect", "monthelectamount", "monthelectmom"], tooltip: "月环比增长率", unit: "万Kwh" },
  { title: "financial.energy.thisYearEnergy", fields: ["yearelect", "yearelectamount", "yearelectmom"], tooltip: "年环比增长率", unit: "万Kwh" },
  { title: "financial.energy.yesterdayWater", fields: ["nowwater", "nowwateramount", "nowwatermom"], tooltip: "日环比增长率", unit: "万m³" },
  { title: "financial.energy.thisMonthWater", fields: ["monthwater", "monthwateramount", "monthwatermom"], tooltip: "月环比增长率", unit: "万m³" },
  { title: "financial.energy.thisYearWater", fields: ["yearwater", "yearwateramount", "yearwatermom"], tooltip: "年环比增长率", unit: "万m³" },
];
</script>

<template>
  <div :class="cn('energy-data-overview flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.energy.energyDataOverview" />
    <div class="grid grid-flow-col grid-rows-[repeat(3,100px)] grid-cols-2 flex-auto content-center items-center gap-x-2 gap-y-2 overflow-hidden">
      <EnergyDataOverviewItem
        v-for="({ title, fields, tooltip, unit }) in columns" :key="title"
        :title="title" :unit="unit" :up="true" :tooltip="tooltip"
        :value1="get(data, fields[0])" :value2="get(data, fields[1])" :percent="get(data, fields[2])" />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.energy-data-overview-item) {
  background:
    linear-gradient(to right, #cc1a1a, #cc1a1a) no-repeat left bottom / 2px 30px,
    linear-gradient(to right, rgba(#cc1a1a, 0.3), rgba(#cc1a1a, 0)) no-repeat left bottom / 100% 30px,
    linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
    linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
    linear-gradient(to bottom, rgba(#ffe5e5, 0.2), rgba(#ffe5e5, 0.2)) no-repeat left top / 2px 100%,
    linear-gradient(270deg, rgba(0, 10, 23, 0.06) 0%, rgba(0, 10, 23, 0.3) 100%);
}
</style>
