<script setup lang="ts">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { get } from "lodash";
import getScrollbarWidth from "@/utils/scrollbar-width.ts";

defineOptions({ name: "BuildCount", inheritAttrs: false });

const { data = [] } = defineProps<{
  data?: any[];
}>();

const columns: IEasyTableProps["columns"] = [
  { title: "所属园区", field: "qymc", align: "center" },
  { title: "楼宇名称", field: "lymc", align: "center" },
  { title: "当前住宿人数", field: "zs", align: "center" },
  { title: "预计退宿人数", field: "ts", align: "center" },
];

const summary = computed(() => {
  return data.reduce(
    (acc, cur) => {
      acc.zs += Number(cur.zs);
      acc.ts += Number(cur.ts);
      return acc;
    },
    { zs: 0, ts: 0 },
  );
});

const scrollContentRef = useTemplateRef<HTMLDivElement>("scrollContentRef");
const scrollbarWidth = ref(0);

async function computerScrollbarWidth() {
  await nextTick();
  if (!scrollContentRef.value) return;
  if (scrollContentRef.value.scrollHeight <= scrollContentRef.value.clientHeight) {
    scrollbarWidth.value = 0;
    return;
  }
  scrollbarWidth.value = getScrollbarWidth(scrollContentRef.value);
}
onMounted(() => {
  computerScrollbarWidth();
});

watch(
  () => data,
  () => {
    computerScrollbarWidth();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <UiEasyTable :columns="columns" :data="data" :height="240">
      <template #footer>
        <div class="flex-1 text-center">
          总计
        </div>
        <div class="flex-1 text-center" />
        <div class="flex-1 text-center">
          {{ get(summary, 'zs', 0) }}
        </div>
        <div class="flex-1 text-center">
          {{ get(summary, 'ts', 0) }}
        </div>
      </template>
    </UiEasyTable>
  </div>
</template>

<style scoped lang="scss">

</style>
