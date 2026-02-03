<script lang="tsx">
import type { CSSProperties, PropType, SlotsType } from "vue";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { TransitionGroup } from "vue";
import { useSwiperData } from "@/hooks";

interface FnParams {
  row: any;
  rowIndex: number;
}

export default defineComponent({
  name: "ScrollBoard",
  props: {
    data: { type: Array as PropType<any[]>, required: true },
    size: { type: Number as PropType<number>, default: 5 },
    rowKey: { type: [String, Function] as PropType<string | ((params: FnParams) => string | number)>, default: "id" },
    rowClassName: { type: [String, Function] as PropType<string | ((params: FnParams) => string)>, default: "" },
    rowStyle: { type: [Function, Object] as PropType<CSSProperties | ((params: FnParams) => CSSProperties)>, default: () => ({}) },
    mode: { type: String as PropType<"single" | "page">, default: "single" },
    space: { type: Number as PropType<number> },
  },
  emits: {
    rowClick: (row: any, rowIndex: number) => true,
  },
  slots: Object as SlotsType<{
    default: { row: any; rowIndex: number };
  }>,
  setup(props, { slots, emit }) {
    let rowKeyFn: ((row: any, rowIndex: number) => string | number);
    let rowClassNameFn: ((row: any, rowIndex: number) => string);
    let rowStyleFn: ((row: any, rowIndex: number) => CSSProperties);

    watchEffect(() => {
      const { rowKey, rowClassName, rowStyle } = props;
      rowKeyFn = typeof rowKey === "function"
        ? (row: any, rowIndex: number) => rowKey({ row, rowIndex })
        : (row: any, rowIndex: number) => get(row, rowKey as string);
      rowClassNameFn = typeof rowClassName === "function"
        ? (row: any, rowIndex: number) => rowClassName({ row, rowIndex })
        : (row: any, rowIndex: number) => rowClassName;
      rowStyleFn = typeof rowStyle === "function"
        ? (row: any, rowIndex: number) => rowStyle({ row, rowIndex })
        : (row: any, rowIndex: number) => rowStyle;
    });

    const { size, data } = toRefs(props);
    const { displayData, startIndex, pause, resume, prev, next } = useSwiperData(data, {
      size,
      gap: computed(() => props.mode === "single" ? 1 : size.value),
      space: computed(() =>
        props.space == null
          ? props.mode === "single" ? 1000 : 2000
          : props.space,
      ),
    });

    const scrollBoardRef = ref<HTMLElement>();

    const { height: scrollBoardHeight } = useElementSize(scrollBoardRef);
    const itemHeight = computed(() => scrollBoardHeight.value / size.value);

    const isHover = useElementHover(scrollBoardRef);
    watch(isHover, hover => hover ? pause() : resume());

    const onWheel = debounce((e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.deltaY > 0 ? next() : prev();
    }, 100);

    const renderRows = () => {
      return displayData.value.map((row, index) => {
        const rowIndex = startIndex.value + index;
        return (
          <div
            key={rowKeyFn(row, rowIndex)}
            style={{ height: `${itemHeight.value}px`, ...rowStyleFn(row, rowIndex) }}
            class={[rowClassNameFn(row, rowIndex)]}
            onClick={() => emit("rowClick", row, rowIndex)}
          >
            {slots?.default?.({ row, rowIndex })}
          </div>
        );
      });
    };

    return () => (
      <div
        ref={scrollBoardRef}
        class="scroll-board relative h-full w-full overflow-hidden"
        onWheel={onWheel}
      >
        <TransitionGroup name={props.mode}>
          {
            props.mode === "single"
              ? renderRows()
              : (
                  <div
                    key={displayData.value.map((row, index) => rowKeyFn(row, index + startIndex.value)).join("-")}
                    style={{ height: `${scrollBoardHeight.value}px` }}
                    class="page-model"
                  >
                    {renderRows()}
                  </div>
                )
          }
        </TransitionGroup>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.single-move, /* 对移动中的元素应用的过渡 */
.single-enter-active,
.single-leave-active {
  transition: all 0.5s ease;
}

//.single-enter-from,
.single-leave-to {
  opacity: 0.5;
  overflow: hidden;
  height: 0 !important;
}

.single-leave-to {
  transform-origin: left top;
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.single-leave-active {
  position: absolute;
  width: 100%;
  //z-index: -1;
}

.page-move, /* 对移动中的元素应用的过渡 */
.page-enter-active,
.page-leave-active {
  transition: all 1s ease;
}

//.page-enter-from,
.page-leave-to {
  opacity: 0.5;
  overflow: hidden;
  height: 0 !important;
}

.page-leave-to {
  transform-origin: left top;
}
</style>
