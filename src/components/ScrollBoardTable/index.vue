<script lang="tsx">
import type { CSSProperties, PropType, VNode } from "vue";
import get from "lodash/get";
import ScrollBoard from "@/components/ScrollBoard/index.vue";
import TextEllipsisTooltip from "@/components/TextEllipsisTooltip/index.vue";
import { cn } from "@/utils";

interface FnParams {
  row: any;
  rowIndex: number;
}

export interface IScrollTableBoardColumn {
  title: (() => string | VNode | VNode[]) | string;
  field: string;
  width?: number;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
  className?: string | ((params: { columnIndex: number;rowIndex: number;row: any;column: IScrollTableBoardColumn; value: any }) => string);
  render?: (params: {
    value: any;
    row: any;
    rowIndex: number;
    column: IScrollTableBoardColumn;
    columnIndex: number;
  }) => string | VNode | VNode[];
}

export default defineComponent({
  name: "ScrollBoardTable",
  props: {
    columns: { type: Array as PropType<IScrollTableBoardColumn[]>, required: true },
    data: { type: Array as PropType<any[]>, required: true },
    size: { type: Number as PropType<number>, default: 5 },
    mode: { type: String as PropType<"single" | "page">, default: "single" },
    rowKey: { type: [String, Function] as PropType<string | ((params: FnParams) => string | number)>, default: "id" },
    space: { type: Number as PropType<number> },
    headerClassName: { type: String, default: "" },
    headerStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    headerCellClassName: {
      type: [String, Function] as PropType<string | ((params: {
        column: IScrollTableBoardColumn;
        columnIndex: number;
      }) => string)>,
      default: "",
    },
    headerCellStyle: {
      type: [Function, Object] as PropType<CSSProperties | ((params: {
        column: IScrollTableBoardColumn;
        columnIndex: number;
      }) => CSSProperties)>,
      default: () => ({}),
    },

    rowClassName: { type: [String, Function] as PropType<string | ((params: FnParams) => string)>, default: "" },
    rowStyle: {
      type: [Function, Object] as PropType<CSSProperties | ((params: FnParams) => CSSProperties)>,
      default: () => ({}),
    },

    rowCellClassName: {
      type: [String, Function] as PropType<string | ((params: FnParams & {
        column: IScrollTableBoardColumn;
        columnIndex: number;
        value: any;
      }) => string)>,
      default: "",
    },
    rowCellStyle: {
      type: [Function, Object] as PropType<CSSProperties | ((params: FnParams & {
        column: IScrollTableBoardColumn;
        columnIndex: number;
        value: any;
      }) => CSSProperties)>,
      default: () => ({}),
    },
  },
  emits: [
    "rowClick",
  ],
  setup(props, { emit }) {
    const { columns, data, size, rowKey, mode, space } = toRefs(props);
    const gridTemplateColumns = computed<CSSProperties>(() => {
      const repeatContent = columns.value.map(({ width }) => width ? `${width}px` : "1fr").join(" ");
      return { gridTemplateColumns: repeatContent };
    });

    let rowClassNameFn: ((row: any, rowIndex: number) => string);
    let rowStyleFn: ((row: any, rowIndex: number) => CSSProperties);
    let rowCellClassNameFn: ((params: FnParams & {
      column: IScrollTableBoardColumn;
      columnIndex: number;
      value: any;
    }) => string);
    let rowCellStyleFn: ((params: FnParams & {
      column: IScrollTableBoardColumn;
      columnIndex: number;
      value: any;
    }) => CSSProperties);
    let headerCellClassNameFn: ((column: IScrollTableBoardColumn, columnIndex: number) => string);
    let headerCellStyleFn: ((column: IScrollTableBoardColumn, columnIndex: number) => CSSProperties);

    watchEffect(() => {
      const { rowClassName, rowStyle, rowCellClassName, rowCellStyle, headerCellClassName, headerCellStyle } = props;
      rowClassNameFn = typeof rowClassName === "function"
        ? (row: any, rowIndex: number) => rowClassName({
            row,
            rowIndex,
          })
        : () => rowClassName;
      rowStyleFn = typeof rowStyle === "function"
        ? (row: any, rowIndex: number) => rowStyle({
            row,
            rowIndex,
          })
        : () => rowStyle;
      rowCellClassNameFn = typeof rowCellClassName === "function"
        ? (params: FnParams & {
          column: IScrollTableBoardColumn;
          columnIndex: number;
          value: any;
        }) => rowCellClassName(params)
        : () => rowCellClassName;
      rowCellStyleFn = typeof rowCellStyle === "function"
        ? (params: FnParams & {
          column: IScrollTableBoardColumn;
          columnIndex: number;
          value: any;
        }) => rowCellStyle(params)
        : () => rowCellStyle;
      headerCellClassNameFn = typeof headerCellClassName === "function"
        ? (column: IScrollTableBoardColumn, columnIndex: number) => headerCellClassName({
            column,
            columnIndex,
          })
        : () => headerCellClassName;
      headerCellStyleFn = typeof headerCellStyle === "function"
        ? (column: IScrollTableBoardColumn, columnIndex: number) => headerCellStyle({
            column,
            columnIndex,
          })
        : () => headerCellStyle;
    });

    const alignClassMap = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    return () => (
      <div class="scroll-table-board h-full w-full flex flex-col">
        <header
          class={["scroll-table-board-header grid flex-shrink-0", props.headerClassName]}
          style={{ ...props.headerStyle, ...gridTemplateColumns.value }}
        >
          {
            columns.value.map((column, columnIndex) => {
              const { title, field, align = "left" } = column;
              return (
                <div
                  class={["scroll-table-board-header-cell flex items-center", alignClassMap[align], headerCellClassNameFn(column, columnIndex)]}
                  key={`${field}-${columnIndex}`}
                  style={headerCellStyleFn(column, columnIndex)}
                >
                  {typeof title === "function" ? title() : title}
                </div>
              );
            })
          }
        </header>
        <div class="scroll-table-board-content flex-auto overflow-hidden">
          <ScrollBoard
            data={data.value}
            size={size.value}
            rowKey={rowKey.value}
            rowClassName={({ row, rowIndex }) => ["scroll-table-board-row grid", rowClassNameFn(row, rowIndex)].join(" ")}
            rowStyle={({ row, rowIndex }) => ({ ...rowStyleFn(row, rowIndex), ...gridTemplateColumns.value })}
            mode={mode.value}
            space={space.value}
            onRowClick={(...args) => emit("rowClick", ...args)}
          >
            {{
              default: ({ row, rowIndex }: { row: any; rowIndex: number }) => (
                columns.value.map((column, columnIndex) => {
                  const { field, align = "left", ellipsis, className, render } = column;
                  const value = get(row, field);
                  const params = { value, row, rowIndex, column, columnIndex };
                  const _className = typeof className === "function" ? className(params) : (className || "");
                  return (
                    <div
                      class={cn(
                        "scroll-table-board-cell h-full w-full flex items-center overflow-hidden",
                        alignClassMap[align],
                        rowCellClassNameFn(params),
                        _className,
                      )}
                      style={rowCellStyleFn(params)}
                    >
                      {
                        render
                          ? render({ value, row, rowIndex, column, columnIndex })
                          : ellipsis ? <TextEllipsisTooltip text={value} class={{ left: "text-left", right: "text-right", center: "text-center" }[align || "left"]} /> : value
                      }
                    </div>
                  );
                })
              ),
            }}
          </ScrollBoard>
        </div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">

</style>
