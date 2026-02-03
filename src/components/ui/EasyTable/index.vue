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
  firstColumnType = "index",
} = defineProps<IEasyTableProps>();

const emits = defineEmits<{
  rowClick: [row: { row: any; rowIndex: number }];
  cellClick: [params: { value: any; row: any; rowIndex: number; column: any; columnIndex: number }];
}>();

export interface IEasyTableProps {
  columns: {
    title: string | (() => string | number | VNode);
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
  firstColumnType?: "index" | "build";
}

const sizeStyle = computed(() => ({
  width: numberToCss(width),
  height: numberToCss(height),
}));

const alignToJustifyContentvValueMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

function columnStyle(column: IEasyTableProps["columns"][number]) {
  const { width, align } = column;

  const style: Record<string, string> = {
    justifyContent: alignToJustifyContentvValueMap[align || "left"],
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
  <section class="easy-table flex flex-col" :style="sizeStyle">
    <header :class="cn('easy-table-header shrink-0 h-[30px] font-title text-[12px]', headerClassName, 'flex')">
      <div class="easy-table-header-first-cell w-[40px] flex shrink-0 items-center pl-1">
        {{ firstColumnType === 'index' ? '序号' : '' }}
      </div>
      <div
        v-for="(column, columnIndex) in columns" :key="column.field"
        :class="cn(
          'easy-table-header-cell px-2',
          typeof headerCellClassName === 'function' ? headerCellClassName({ column, columnIndex }) : headerCellClassName,
          !column.width && 'flex-1',
          'flex items-center',
        )"
        :style="columnStyle(column)">
        <component :is="column.title" v-if="typeof column.title === 'function'" />
        <template v-else>
          {{ column.title }}
        </template>
      </div>
      <span class="inline-block shrink-0" :style="{ width: numberToCss(scrollbarWidth) }" />
    </header>
    <main class="easy-table-body flex-auto overflow-hidden text-[12px] leading-none">
      <div ref="overflowContainer" class="h-full overflow-y-auto">
        <EmptyWrapper :is-empty="!data.length">
          <div
            v-for="(row, rowIndex) in data" :key="rowIndex"
            :class="cn(
              'easy-table-row h-[45px] pb-[5px]',
              typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName,
              'flex items-center overflow-hidden',
            )"
            @click="emits('rowClick', { row, rowIndex })">
            <div class="easy-table-row-first-cell h-full w-[40px] flex shrink-0 items-center pl-2 text-[14px]">
              <span v-if="firstColumnType === 'index'" class="font-number">{{ rowIndex + 1 }}.</span>
              <span v-if="firstColumnType === 'build'">
                <i class="i-svg-icon-build" />
              </span>
            </div>
            <div
              v-for="(column, columnIndex) in columns" :key="column.field"
              :style="columnStyle(column)"
              :class="cn(
                'easy-table-row-cell h-full flex items-center px-2',
                typeof rowCellClassName === 'function' ? rowCellClassName({ value: row[column.field], row, rowIndex, column, columnIndex }) : rowCellClassName,
                typeof column.className === 'function' ? column.className({ value: row[column.field], row, rowIndex, column, columnIndex }) : column.className,
                !column.width && 'flex-1 overflow-hidden',

              )"
              @click="emits('cellClick', { column, columnIndex, value: row[column.field], row, rowIndex })">
              <Component
                :is="() => column.render!({ value: row[column.field], row, column, rowIndex, columnIndex })"
                v-if="column.render" />
              <template v-else>
                <span class="inline-block w-full" :class="column.ellipsis && 'truncate'" :title="row[column.field]">
                  {{ row[column.field] }}
                </span>
              </template>
            </div>
          </div>
        </EmptyWrapper>
      </div>
    </main>
    <footer v-if="$slots.footer" class="easy-table-footer shrink-0 text-[12px] font-title">
      <div class="easy-table-row h-[40px] flex items-center overflow-hidden">
        <div class="easy-table-row-first-cell h-full w-[40px] flex shrink-0 items-center" />
        <slot name="footer" />
        <span class="inline-block shrink-0" :style="{ width: numberToCss(scrollbarWidth) }" />
      </div>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.easy-table {
  .easy-table-body,
  .easy-table-footer {
    .easy-table-row {
      position: relative;
      & > .easy-table-row-cell {
        position: relative;
        z-index: 2;
      }

      &::after {
        content: "";
        height: 40px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 34px;
        z-index: 1;
        background:
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
          linear-gradient(to bottom, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left 1px / 1px calc(100% - 2px),
          rgba(#000a17, 0.3);
        transform: skewX(164deg);
        pointer-events: none;
      }

      &:hover:after {
        background:
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left top / 100% 1px,
          linear-gradient(to right, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0)) no-repeat left bottom / 100% 1px,
          linear-gradient(to bottom, rgba(#fff3f3, 0.2), rgba(#fff3f3, 0.2)) no-repeat left 1px / 1px calc(100% - 2px),
          linear-gradient(to right, rgba(#cc1a1a, 0.6), rgba(#611010, 0.2)) no-repeat left top / 100% 100%,
          rgba(#000a17, 0.3);
      }

      .easy-table-row-first-cell {
        background:
          linear-gradient(to right, rgba(#cc1a1a, 0.6), rgba(#611010, 0.2)) no-repeat left top / 100% 100%,
          linear-gradient(to right, #fff3f3, rgba(#fff3f3, 0.1)) no-repeat left top / 100% 1px,
          linear-gradient(to right, #fff3f3, rgba(#fff3f3, 0.1)) no-repeat left bottom / 100% 1px,
          linear-gradient(107deg, rgba(#fff3f3, 0) 35px, rgba(#fff3f3, 0.1) 32px, rgba(#fff3f3, 0.1)) no-repeat left
            top / 100% 100%,
          linear-gradient(to bottom, #fff3f3, #fff3f3) no-repeat left top / 1px 100%;
        clip-path: polygon(0 0, calc(100% - 2px) 0, 27px 100%, 0% 100%);
      }
    }
  }
}
</style>
