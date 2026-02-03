<script lang="ts">
import type { PropType } from "vue";
import { Empty } from "ant-design-vue";
import { numberToCss } from "@/utils";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

export default defineComponent({
  name: "EmptyWrapper",
  props: {
    width: {
      type: [String, Number] as PropType<string | number>,
      default: "100%",
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: "100%",
    },
    isEmpty: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    description: {
      type: String as PropType<string>,
      default: "暂无数据",
    },
  },
  setup(props, { slots }) {
    return () =>
      props.isEmpty
        ? h(
            "div",
            {
              class: "empty-wrapper flex items-center justify-center",
              style: {
                width: numberToCss(props.width),
                height: numberToCss(props.height),
              },
            },
            h(Empty, {
              description: props.description,
              image: simpleImage,
              class: "[&>.ant-empty-description]:text-white [&>.ant-empty-description]:!text-[12px]",
            }),
          )
        : slots.default?.();
  },
});
</script>
