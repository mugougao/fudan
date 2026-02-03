<script setup lang="tsx">
import to from "await-to-js";
import get from "lodash/get";
import { fetchInfrastructurePointDetail } from "@/api/financial/index.ts";

defineOptions({ name: "CampusPointMarkerPopup", inheritAttrs: false });
const { id, type, title } = defineProps<{
  id?: string;
  title?: string;
  type?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const visible = defineModel<boolean>("visible", { default: false });

const columns = computed(() => {
  return [
  // { label: "设备名称", field: "name" },
    { label: type === "自助报账投递机" ? "设备编号" : "设备类型", field: "extended_field" },
    { label: "所属校区", field: "xq" },
    { label: "所在楼宇", field: "lyid", render: value => title ?? value },
    { label: "所在楼层", field: "floor" },
  ];
});

const { state, execute } = useAsyncState(
  async () => {
    if (!id || !type) return [];
    const [,res] = await to(fetchInfrastructurePointDetail(id, type));
    return res?.resultData || [];
  },
  [],
  { immediate: false, resetOnExecute: false },
);

watch(
  () => [visible.value, id],
  () => {
    if (visible.value && id) {
      execute();
    }
  },
);

function RenderTitle({ data = {} }: { data?: any }) {
  const number = get(data, "extended_field", "");
  const name = get(data, "name", "")?.replace(number, "");
  return (
    <div class="mb-5 flex flex-col px-2">
      <span class="text-[18px] text-[#FFF7C6] font-text-bold">{number}</span>
      <span class="text-[14px] text-[#A8A8A8] font-text-medium">{name}</span>
    </div>
  );
}
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="title" :width="450" left="400" :top="100"
    @close="() => emit('close')">
    <ThirdTitle>{{ type }}详表</ThirdTitle>
    <div class="mt-3 h-[280px] flex flex-wrap overflow-y-auto pt-2 -mx-2">
      <section
        v-for="(item, index) in state" :key="index"
        class="mb-3 w-1/2 px-2">
        <div class="border-2 border-[#DDCB72] rounded-lg bg-[#5C5D3D]/35">
          <header class="relative mx-[-1px] mt-[-2px] h-[45px] overflow-hidden rounded-lg px-2 pt-1">
            <i
              class="text-md text-white/50"
              :class="type === '自助报账投递机' ? 'i-svg-financial-selfServiceExpenseReportKiosk' : 'i-svg-financial-cardReplacementMachine' " />
            <span class="absolute right-[-20px] top-0 block h-[30px] w-[100px] skew-x-45 rounded-lb-lg bg-[#DDCB72]" />
            <span
              class="absolute right-0 top-[29px] block size-[15px]"
              style="background: radial-gradient(circle at 0% 100%,transparent 0%,transparent 70%,#DDCB72 70%,#DDCB72 100%);" />
          </header>
          <main class="pb-3">
            <RenderTitle :data="item" />
            <div class="grid grid-cols-2 gap-y-3">
              <div v-for="col in columns" :key="col.field" class="flex flex-col items-start px-2">
                <span class="from-[#FFF2C9] to-white bg-gradient-to-b bg-clip-text text-[14px] text-transparent font-text-bold">
                  <template v-if="col.render">
                    <Component :is="col.render" :value="get(item, col.field)" />
                  </template>
                  <template v-else>
                    {{ get(item, col.field, '--') }}
                  </template>
                </span>
                <span class="text-[12px] text-[#A8A8A8] font-text-medium">{{ col.label }}</span>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
