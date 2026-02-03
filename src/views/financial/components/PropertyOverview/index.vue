<script setup lang="tsx">
import type { FunctionalComponent } from "vue";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "PropertyOverview", inheritAttrs: false });

const PropertyOverviewItem: FunctionalComponent<{
  title: string;
  value: string | number;
}> = (props) => {
  const { title, value } = props;
  return (
    <div class="property-overview-item flex overflow-hidden">
      <div class="property-overview-item-title overflow-hidden">
        <span class="icon-box-bg z-1" />
        <div class="relative z-2 h-full w-full flex items-center gap-1.5 pl-2 text-[14px] font-text-medium">
          <i class="i-svg-icon-build" />
          <span>{ title }</span>
        </div>
      </div>
      <div class="content-box-bg" />
      <div class="property-overview-item-value flex items-center justify-between px-3">
        <span class="text-[22px] font-number">{ numberToThousands(value) }</span>
        <span class="text-[14px] text-[#C6C6C6]">万元</span>
      </div>
    </div>
  );
};
</script>

<template>
  <div :class="cn('property-overview', $attrs.class ?? '')">
    <UiSubTitle title-path="financial.index.electricityUseOverview" />
    <div class="px-2 py-2.5 space-y-1.5">
      <PropertyOverviewItem :title="$t('financial.index.annualInsurance')" value="123456" />
      <PropertyOverviewItem :title="$t('financial.index.annualInsurance')" value="123456" />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.property-overview-item) {
  height: 40px;
  position: relative;
  .property-overview-item-title {
    position: relative;
    width: 130px;
    height: 40px;
    .icon-box-bg {
      position: absolute;
      inset: 0;
      width: 145px;
      height: 100%;
      background-color: rgba(#cc1a1a, 0.6);
      border: 1px rgba(#fff3f3, 0.2) solid;
      transform: skewX(-30deg) translateX(-25px);
      mask: linear-gradient(50deg, rgba(#000, 1) 50%, rgba(#000, 0) 100%);
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 1px;
      background: rgba(#fff3f3, 0.2);
    }
  }
  .content-box-bg {
    position: absolute;
    top: 0;
    left: 125px;
    width: 200px;
    height: 40px;
    background:
      linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
      linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left 1px / 1px calc(100% - 2px),
      linear-gradient(to right, rgba(#000a17, 0.3), transparent);
    transform: skewX(-30deg);
  }
  .property-overview-item-value {
    position: relative;
    height: 40px;
    width: calc(100% - 130px);
  }
}
</style>
