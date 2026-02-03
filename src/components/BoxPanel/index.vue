<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "BoxPanel" });
const { title } = defineProps<{
  title?: string;
  contentClassName?: string;
}>();
</script>

<template>
  <section class="box-panel wh-full flex flex-col">
    <header class="box-panel-header relative h-45px flex flex-shrink-0 items-center border-b-2 border-#D8D8D8/30 pl-40px pr-8px">
      <div class="box-panel-header-title h-full flex flex-auto items-center overflow-hidden text-24px text-white font-title">
        <slot name="title">
          <!-- <TextEllipsisTooltip :text="title" /> -->
          <div class="truncate whitespace-nowrap" :title="title">
            {{ title }}
          </div>
        </slot>
      </div>
      <div v-if="$slots?.extra" class="box-panel-header-extra flex-shrink-0">
        <slot name="extra" />
      </div>
    </header>
    <main class="box-panel-body flex-auto overflow-hidden">
      <div :class="cn('box-panel-content wh-full overflow-y-auto overflow-x-hidden p-2', contentClassName)">
        <slot />
      </div>
    </main>
  </section>
</template>

<style scoped lang="scss">
.box-panel {
  background: rgba(0, 0, 0, 0.65);
  .box-panel-header {
    background:
      url("@/assets/images/ring.png") no-repeat 8px center / 24px,
      url("@/assets/images/logo.png") no-repeat 13px center / 14px;
    &:after {
      content: "";
      @apply absolute -bottom-2px left-16px h-2px w-30px bg-white;
    }
  }
}
</style>
