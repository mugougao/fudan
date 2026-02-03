<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BoxPanel" });
const { title = "", titlePath } = defineProps<{
  title?: string;
  titlePath?: string;
  contentClassName?: string;
}>();
</script>

<template>
  <section class="box-panel wh-full flex flex-col">
    <header class="box-panel-header relative h-[28px] flex items-start whitespace-nowrap leading-none">
      <i class="i-svg-icon-logo absolute left-[2px] top-0 text-[18px]" />
      <div class="box-panel-header-title ml-[35px] h-full flex-auto overflow-hidden truncate">
        <span class="box-panel-header-title-text text-[20px] font-title">{{ titlePath ? $t(titlePath) : title }}</span>
        <span v-if="$slots.titleSuffix">
          <slot name="titleSuffix" />
        </span>
      </div>
      <div class="box-panel-header-subtitle absolute bottom-[-2px] right-0 text-[10px]">
        <span v-t="{ path: titlePath ?? '', locale: 'en' }" class="text-[#E1E1E1] tracking-[1.35px]" />
      </div>
    </header>
    <main class="box-panel-body relative flex-auto overflow-hidden">
      <span class="line-top" />
      <span class="line-bottom" />
      <div :class="cn('box-panel-content absolute inset-0 wh-full overflow-y-auto overflow-x-hidden p-2 pt-2', contentClassName)">
        <slot />
      </div>
    </main>
  </section>
</template>

<style scoped lang="scss">
.box-panel {
  background: rgba(0, 10, 23, 0.06);
  background: url("@/assets/images_new/layout_default/box-panel-bg.png") no-repeat 7px 7px / 341px 27px;
  backdrop-filter: blur(10px);
  &::before,
  &::after {
    content: "";
    height: 50px;
    width: 4px;
    position: absolute;
    top: calc(50% - 15px);
    background:
      linear-gradient(to bottom, #fff, #fff) no-repeat center top / 3px 2px,
      linear-gradient(to bottom, #fff, #fff) no-repeat center bottom / 3px 2px,
      linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)) no-repeat center bottom / 1px
        100%,
      linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)) no-repeat center / 2px 50%;
  }

  &::before {
    left: 5px;
  }
  &::after {
    right: 5px;
  }

  .box-panel-header-title {
    .box-panel-header-title-text {
      -webkit-text-stroke: 0.45px #611010;
      text-shadow: 0.45px 0.9px 0.9px rgba(0, 0, 0, 0.7);
    }
  }

  .box-panel-body {
    .line-top,
    .line-bottom {
      display: inline-block;
      width: 100%;
      height: calc(50% - 20px);
      position: absolute;
      mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), #000, rgba(0, 0, 0, 0.1));
      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 0;
        width: 15px;
        height: 100%;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
    }

    .line-top {
      top: 10px;
      &::before {
        border-top: 1px #fff solid;
        border-left: 1px #fff solid;
        transform: skewY(-25deg);
      }
      &::after {
        border-top: 1px #fff solid;
        border-right: 1px #fff solid;
        transform: skewY(25deg);
      }
    }
    .line-bottom {
      bottom: 10px;
      &::before {
        border-bottom: 1px #fff solid;
        border-left: 1px #fff solid;
        transform: skewY(25deg);
      }
      &::after {
        border-bottom: 1px #fff solid;
        border-right: 1px #fff solid;
        transform: skewY(-25deg);
      }
    }
  }
}
</style>
