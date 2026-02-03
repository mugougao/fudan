<script setup lang="tsx">
import { cn } from "@/utils";

defineOptions({ name: "ImplementInfo", inheritAttrs: false });
</script>

<template>
  <div :class="cn('implement-info grid grid-cols-2 grid-rows-2 gap-y-1 gap-x-2 px-1', $attrs.class ?? '')">
    <div class="col-span-full">
      <span>
        <i class="i-svg-icon-construction" />
        <span>建设单位</span>
      </span>
      <span>上海建筑设计研究院有限公司，上海申元岩土工程有限公司</span>
    </div>
    <div>
      <span>
        <i class="i-svg-icon-implement" />
        <span>施工单位</span>
      </span>
      <span>上海建工二建集团有限公司</span>
    </div>
    <div>
      <span>
        <i class="i-svg-icon-responsibility" />
        <span>责任单位</span>
      </span>
      <span>上海三凯工程咨询有限公司</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.implement-info {
  & > div {
    display: flex;
    align-items: center;
    background-image: url("@/assets/images_new/list-bg-3.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    &:first-child {
      background-image: url("@/assets/images_new/list-bg-2.png");
    }
    & > span {
      &:first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        width: 65px;
        height: 52px;
        flex-shrink: 0;
        span {
          font-size: 12px;
          font-family: "AlibabaPuHuiTi-3-medium";
          color: #fff;
        }
      }
      &:nth-child(2) {
        flex: auto;
        color: #ffe5e5;
        font-size: 12px;
        line-height: 1;
        padding: 0 3px;
      }
    }
  }
}
</style>
