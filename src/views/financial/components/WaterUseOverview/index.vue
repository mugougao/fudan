<script setup lang="tsx">
import type { FunctionalComponent } from "vue";
import { Tooltip } from "ant-design-vue";
import { get } from "lodash";
import { useI18n } from "vue-i18n";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "WaterUseOverview", inheritAttrs: false });

const { data = {} } = defineProps<{
  data?: Record<string, any>;
}>();

const columns = [
  { title: "financial.index.yesterday", kwfField: "nowwater", moneyField: "nowwateramount", rateField: "nowwatermom", tooltip: "日环比增长率" },
  { title: "financial.index.month", kwfField: "monthwater", moneyField: "monthwateramount", rateField: "monthwatermom", tooltip: "月环比增长率" },
  { title: "financial.index.year", kwfField: "yearelect", moneyField: "yearwateramount", rateField: "yearwatermom", tooltip: "年环比增长率" },
];

const { t } = useI18n();

const ElectricOverviewItem: FunctionalComponent<{
  name: string;
  kwh: number | string;
  money: number | string;
  rate: number | string;
  tooltip: string;
}> = ({ name, kwh, money, rate, tooltip }) => {
  const up = Number(rate) > 0;

  return (
    <div class="electric-overview-item relative h-[100px] flex items-center whitespace-nowrap">
      <div class="icon-box h-[100px] w-[95px] flex flex-col shrink-0 items-center justify-center">
        <span class="icon">
          <i class="i-svg-icon-electric from-[#FFC2C2] to-white bg-gradient-to-b text-3xl"></i>
        </span>
        <span class="mt-2 text-[14px] text-white font-text-medium">{name}</span>
      </div>
      <div class="content-box ml-1 h-[100px] flex flex-col flex-auto justify-between px-2.5">
        <span class="mt-2 text-[14px] text-white/60">
          {name}
          {t("financial.index.waterUse")}
        </span>

        <span class="flex items-center justify-between">
          <span>
            <span class="text-[20px] text-white/80 font-number">{numberToThousands(kwh)}</span>
            <span class="ml-0.5 text-[12px] text-[#9E9E9E]">万m³</span>
          </span>
          <span class="text-[14px] text-white font-number">
            <i class={cn("i-svg-icon-arrow text-[10px]", up ? "text-[#83F4C2] rotate-180 -scale-x-100" : " text-[#BF3F38]")}></i>
            <span class={cn("bg-gradient-to-b to-white bg-clip-text text-transparent", up ? "from-[#699F87]" : "from-[#D45F5F]")}>{`${rate}%`}</span>
          </span>
        </span>

        <span class="h-[30px] flex items-center justify-between">
          <span class="text-[14px] leading-none">
            {t("financial.index.electricityAmount")}
            :
          </span>
          <span>
            <span class="empty-number text-[22px] leading-none font-number">{ numberToThousands(money) }</span>
            <span class="inline-block pb-2 text-[14px] text-[#C6C6C6] leading-none">万元</span>
          </span>
        </span>
      </div>

      <Tooltip title={tooltip}>
        <i class="i-ri-information-2-line absolute right-2 top-2.5 text-[12px] text-[#B4B4B4]"></i>
      </Tooltip>
    </div>
  );
};
</script>

<template>
  <div :class="cn('water-use-overview', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.electricityUseOverview" />
    <div class="px-2 pt-2 space-y-1.5">
      <ElectricOverviewItem
        v-for="{ title, kwfField, moneyField, rateField, tooltip } in columns" :key="kwfField"
        :name="$t(title)" :tooltip="tooltip"
        :kwh="get(data, kwfField)" :money="get(data, moneyField)" :rate="get(data, rateField)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.electric-overview-item) {
  position: relative;
  .icon-box {
    background:
      linear-gradient(
          to bottom,
          #ffe5e5 0%,
          #ffe5e5 2px,
          rgba(#ffe5e5, 0.2) 2px,
          rgba(#ffe5e5, 0.2) calc(100% - 2px),
          #ffe5e5
        )
        no-repeat left top / 2px 100%,
      linear-gradient(to bottom, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.3) 100%) no-repeat left 1px / 1px
        calc(100% - 2px),
      linear-gradient(to right, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left top / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left bottom / 100% 1px,
      linear-gradient(to bottom, rgba(#fff3f3, 0.08) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat right 1px / 1px
        calc(100% - 2px),
      linear-gradient(90deg, rgba(#cc1a1a, 0.4) 0%, rgba(#611010, 0.08) 100%),
      linear-gradient(270deg, rgba(#000a17, 0.06) 0%, rgba(#000a17, 0.3) 100%);

    span.icon {
      display: block;
      -webkit-box-reflect: below 1px linear-gradient(transparent, #0000001a);
    }
  }

  .content-box {
    background:
      linear-gradient(to right, #cc1a1a 0%, #cc1a1a 100%) no-repeat left bottom / 3px 30px,
      linear-gradient(to right, rgba(#cc1a1a, 0.3) 0%, rgba(#cc1a1a, 0) 100%) no-repeat left bottom / 100% 30px,
      linear-gradient(to bottom, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.3) 100%) no-repeat left 1px / 1px
        calc(100% - 2px),
      linear-gradient(to right, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left top / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.3) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left bottom / 100% 1px,
      linear-gradient(270deg, rgba(#000a17, 0.3) 12%, rgba(#000a17, 0.06) 100%);
  }
}
</style>
