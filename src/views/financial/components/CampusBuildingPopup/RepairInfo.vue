<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { numberToThousands } from "@/utils";

defineOptions({ name: "RepairInfo", inheritAttrs: false });

function BaseInfoItem({ title, subtitle, value1, value2 }: { title: string; subtitle: string; value1: string | number; value2: string | number }) {
  return (
    <div class="base-info-item flex">
      <span class="base-info-item-icon flex flex-col shrink-0 items-center justify-center">
        <span class="icon">
          <i class="i-svg-icon-repair from-[#FFC2C2] to-white bg-gradient-to-b text-2xl" />
        </span>
        <span class="mt-1 text-[12px] font-text-medium">
          {subtitle}
        </span>
      </span>
      <span class="base-info-item-content ml-1 h-full flex flex-col flex-auto px-1 children:leading-none">
        <span class="block h-[24px] from-[#FFC2C2] to-white bg-gradient-to-b bg-clip-text text-transparent font-text-medium !leading-[24px]">{ title }</span>
        <span class="mt-1 flex items-center text-[12px]">
          <span class="mr-auto text-[12px] text-white">次数：</span>
          <span class="from-[#FFC2C2] to-white bg-gradient-to-b bg-clip-text text-[18px] text-transparent font-number">{ numberToThousands(value1) }</span>
          <span class="text-[#C6C6C6]">次</span>
        </span>
        <span class="mt-1 flex items-center text-[12px]">
          <span class="mr-auto text-[12px] text-white">金额：</span>
          <span class="from-[#F7C998] to-white bg-gradient-to-b bg-clip-text text-[18px] text-transparent font-number">{ numberToThousands(value2) }</span>
          <span class="text-[#C6C6C6]">万元</span>
        </span>
      </span>
    </div>
  );
}

const columns: IEasyTableProps["columns"] = [
  { title: "时间", field: "time", align: "center", width: 68 },
  { title: "名称", field: "name", align: "center" },
  {
    title: () => (
      <span class="flex flex-col text-center leading-none">
        <span>金额</span>
        <span class="ml-1 text-[10px] text-white/60 font-text">(万元)</span>
      </span>
    ),
    field: "value",
    align: "center",
  },
  { title: "项目状态", field: "status", align: "center" },
  { title: "经费来源", field: "source", align: "center" },
];

const data = Array.from({ length: 20 }, (_, index) => {
  return {
    index: index + 1,
    time: "2023-01-01",
    name: `name${index}`,
    value: `1234567`,
    status: `status${index}`,
    source: `source${index}`,
  };
});
</script>

<template>
  <div class="repair-info">
    <UiThirdTitle title="修缮信息" class="my-3" />
    <div class="chart-box flex gap-x-4">
      <div class="w-[220px] flex flex-col shrink-0 gap-3">
        <BaseInfoItem subtitle="日常修缮" title="本年度日常修缮" value1="1234567" value2="1234567" />
        <BaseInfoItem subtitle="规模修缮" title="本年度规模修缮" value1="1234567" value2="1234567" />
      </div>
      <div class="flex-auto">
        <UiEasyTable :height="160" :columns="columns" :data="data" row-cell-class-name="px-0" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  background: linear-gradient(to bottom, transparent 0%, #fff, transparent) no-repeat 228px center / 1px 100%;
}

:deep(.base-info-item) {
  .base-info-item-icon {
    width: 60px;
    height: 76px;
    background:
      linear-gradient(to bottom, transparent 0%, #fff, transparent) no-repeat 240px center / 1px 100%,
      linear-gradient(to right, rgba(#ffe5e5, 0.2) 0%, rgba(#ffe5e5, 0.2) 100%) no-repeat left top / 1px 100%,
      linear-gradient(to right, rgba(#fff3f3, 0.2) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left top / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.2) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat left bottom / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.08) 0%, rgba(#fff3f3, 0.08) 100%) no-repeat right top / 1px 100%,
      linear-gradient(90deg, rgba(204, 26, 26, 0.6) 0%, rgba(97, 16, 16, 0.36) 100%),
      linear-gradient(270deg, rgba(0, 10, 23, 0.06) 0%, rgba(0, 10, 23, 0.3) 100%);

    .icon {
      display: inline-block;
      -webkit-box-reflect: below 1px linear-gradient(transparent, #0000001a);
    }
  }

  .base-info-item-content {
    height: 76px;
    background:
      linear-gradient(to right, #cc1a1a, #cc1a1a) no-repeat left top / 2px 24px,
      linear-gradient(to right, rgba(#cc1a1a, 0.2), rgba(#cc1a1a, 0)) no-repeat left top / 100% 24px,
      linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
      linear-gradient(to bottom, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left top / 1px 100%,
      linear-gradient(to right, rgba(0, 10, 23, 0.3) 12%, rgba(0, 10, 23, 0.06) 100%);
  }
}
</style>
