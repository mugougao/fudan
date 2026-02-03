<script setup lang="ts">
import type { VNode } from "vue";
import { cn, numberToCss } from "@/utils";
import getScrollbarWidth from "@/utils/scrollbar-width.ts";

defineOptions({ name: "EasyTable" });
const {
  columns,
  data,
  height = "100%",
  width = "100%",
  headerClassName = "",
  headerCellClassName = "",
  rowClassName = "",
  rowCellClassName = "",
  hasHoverClass = true,
} = defineProps<IEasyTableProps>();

const emits = defineEmits<{
  rowClick: [row: { row: any; rowIndex: number }];
  cellClick: [params: { value: any; row: any; rowIndex: number; column: any; columnIndex: number }];
}>();

export interface IEasyTableProps {
  columns: {
    title: string;
    field: string;
    width?: string | number;
    align?: "left" | "center" | "right";
    render?: (params: { value: any; row: any; rowIndex: number; column: any; columnIndex: number }) => string | number | VNode;
    ellipsis?: boolean;
    className?: string | ((params: { value: any; row: any; rowIndex: number; column: any; columnIndex: number }) => string);
  }[];
  data: Array<any>;
  height?: string | number;
  width?: string | number;
  headerClassName?: string;
  headerCellClassName?: string | ((params: { column: any; columnIndex: number }) => string);
  rowClassName?: string | ((params: { row: any; rowIndex: number }) => string);
  rowCellClassName?: string | ((params: { value: any; row: any; rowIndex: number; column: any; columnIndex: number }) => string);
  hasHoverClass?: boolean;
}

const sizeStyle = computed(() => ({
  width: numberToCss(width),
  height: numberToCss(height),
}));

function columnStyle(column: IEasyTableProps["columns"][number]) {
  const { width, align } = column;
  const style: Record<string, string> = {
    textAlign: align || "left",
  };
  if (width) {
    Object.assign(style, {
      width: numberToCss(width),
      flexShrink: "0",
    });
  }
  return style;
}

const overflowContainer = useTemplateRef<HTMLDivElement>("overflowContainer");
const scrollbarWidth = ref(0);
async function computeScrollbarWidth() {
  await nextTick();
  scrollbarWidth.value = getScrollbarWidth(overflowContainer.value!);
}
onMounted(() => {
  computeScrollbarWidth();
});

watch(() => [columns, data], () => {
  computeScrollbarWidth();
});
</script>

<template>
  <div class="easy-table flex flex-col" :style="sizeStyle">
    <div
      :class="cn(
        'easy-table-header flex-shrink-0',
        'flex',
        headerClassName,
      )">
      <div
        v-for="(column, columnIndex) in columns" :key="column.field"
        :class="cn(
          'easy-table-header-cell',
          !column.width && 'flex-1',
          'text-[#9E9E9E] font-text-medium text-[14px]',
          typeof headerCellClassName === 'function' ? headerCellClassName({ column, columnIndex }) : headerCellClassName,
        )"
        :style="columnStyle(column)">
        {{ column.title }}
      </div>
      <div :style="{ width: numberToCss(scrollbarWidth) }" />
    </div>
    <div class="easy-table-body flex-auto overflow-hidden">
      <div ref="overflowContainer" class="h-full snap-y snap-mandatory overflow-y-auto">
        <EmptyWrapper :is-empty="!data.length">
          <div
            v-for="(row, rowIndex) in data" :key="rowIndex"
            :class="cn(
              'easy-table-row snap-center',
              hasHoverClass && 'easy-table-row-hover',
              'flex items-center text-[16px] font-number',
              typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName,
            )"
            @click="emits('rowClick', { row, rowIndex })">
            <div
              v-for="(column, columnIndex) in columns" :key="column.field"
              :style="columnStyle(column)"
              :class="cn(
                'easy-table-row-cell overflow-hidden',
                'py-2',
                !column.width && 'flex-1',
                typeof rowCellClassName === 'function' ? rowCellClassName({ value: row[column.field], row, rowIndex, column, columnIndex }) : rowCellClassName,
                typeof column.className === 'function' ? column.className({ value: row[column.field], row, rowIndex, column, columnIndex }) : column.className,
              )"
              @click="emits('cellClick', { column, columnIndex, value: row[column.field], row, rowIndex })">
              <Component
                :is="() => column.render!({ value: row[column.field], row, column, rowIndex, columnIndex })"
                v-if="column.render" />

              <template v-else>
                <TextEllipsisTooltip
                  v-if="column.ellipsis"
                  :text="row[column.field]"
                  :class="{ left: 'text-left', right: 'text-right', center: 'text-center' }[column.align || 'left']" />
                <template v-else>
                  {{ row[column.field] }}
                </template>
              </template>
            </div>
          </div>
        </EmptyWrapper>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.easy-table {
  .easy-table-body {
    .easy-table-row.easy-table-row-hover {
      &:hover {
        background:
          linear-gradient(90deg, rgba(#cfeaff, 0) 0%, rgba(#cfeaff, 0.33) 60%, rgba(#cfeaff, 0) 100%) no-repeat left
            top / 100% 2px,
          linear-gradient(90deg, rgba(#cfeaff, 0) 0%, rgba(#cfeaff, 0.33) 60%, rgba(#cfeaff, 0) 100%) no-repeat left
            bottom / 100% 2px,
          linear-gradient(90deg, rgba(#b0d1ff, 0) 0%, rgba(#b0d1ff, 0.33) 60%, rgba(#b0d1ff, 0) 100%);
        color: #aae5fb;
      }
    }
  }
}
</style>
