<script setup lang="ts">
import type { IScrollTableBoardColumn } from "@/components/ScrollBoardTable/index.vue";
import ScrollBoardTable from "@/components/ScrollBoardTable/index.vue";
import { cn } from "@/utils";

defineOptions({ name: "ScrollBoardTableWrap" });

const { columns = [], data = [], size = 5, rowKey = "id", headerCellClassName, rowClassName } = defineProps<{
  columns?: IScrollTableBoardColumn[];
  data?: any[];
  size?: number;
  rowKey?: string | ((params: { row: any; rowIndex: number }) => string | number);
  headerCellClassName?: string;
  rowClassName?: string;
}>();

const emits = defineEmits<{
  rowClick: [params: { row: any; rowIndex: number }];
}>();
</script>

<template>
  <div class="scroll-board-table-wrap wh-full">
    <ScrollBoardTable
      :columns="columns" :data="data" :size="size" :row-key="rowKey"
      :space="10000"
      :header-cell-class-name="cn(
        'text-#AFB9C3 text-16px',
        headerCellClassName,
      )"
      :row-class-name="cn(
        'scroll-board-table-wrap-row-class',
        rowClassName,
      )"
      @row-click="params => emits('rowClick', params)" />
  </div>
</template>

<style>
.scroll-board-table-wrap {
  .scroll-board-table-wrap-row-class {
    @apply relative;
    &:after {
      content: "";
      height: calc(100% - 6px);
      @apply: absolute left-0 right-0 w-full top-3px bottom-3px rounded overflow-hidden pointer-events-none;
      background: linear-gradient(
        270deg,
        rgba(137, 172, 209, 0.28) 0%,
        rgba(137, 172, 209, 0.28) 65%,
        rgba(114, 189, 202, 0) 97%
      );
    }
  }
}
</style>
