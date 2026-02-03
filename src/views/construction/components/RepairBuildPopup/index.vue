<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import to from "await-to-js";
import { fetchBuildingRepairingHistory, fetchBuildingRepairingInfo } from "@/api/construction/repair.ts";
import DailyRepairsInfo from "./DailyRepairsInfo.vue";
import LargeScaleRepairs from "./LargeScaleRepairs.vue";
import RepairHistoryDetailPopup from "./RepairHistoryDetailPopup.vue";

defineOptions({ name: "RepairBuildPopup", inheritAttrs: false });

const { id, title } = defineProps<{
  id: string;
  title: string;
}>();

const visible = defineModel<boolean>("visible", { default: false });

const { state, execute } = useAsyncState(
  async () => {
    const [
      [,res1],
      [,res2],
    ] = await Promise.all([
      to(fetchBuildingRepairingInfo(id)),
      to(fetchBuildingRepairingHistory(id)),
    ]);

    return {
      info: res1?.resultData || {},
      history: res2?.resultData || [],
    };
  },
  { info: {}, history: [] },
  { immediate: false, resetOnExecute: false },
);

watch(
  () => [visible.value, id],
  ([visible, id]) => {
    if (visible && id) execute();
  },
);

const type = ref("1");
const DescriptionComponentMap = {
  1: DailyRepairsInfo,
  2: LargeScaleRepairs,
};

function StatusTag({ status }: { status: "立项" | "合同" | "开工" }) {
  const color = { 立项: "#38FFF8", 合同: "#2FA1FF", 开工: "#DCE978" }[status];
  return (
    <span
      style={{ "--color": color }}
      class="border border-$color rounded-full bg-[#D8D8D8]/10 px-2 py-[1px] text-[12px] text-$color"
    >
      {status}
    </span>
  );
}

const showRepairHistoryDetailPopup = ref(false);
const showRepairHistoryDetail = ref<any>({});

const tableColumns: IEasyTableProps["columns"] = [
  { title: "时间", field: "开工时间", align: "center" },
  { title: "项目名称", field: "项目名称", align: "center" },
  {
    title: "详情",
    field: "action",
    align: "center",
    render: ({ row }) => (
      <span
        class="cursor-pointer border border-[#CC1A1A] rounded-full bg-[#CC1A1A]/25 px-2 py-0.5 text-[12px] text-white/80 hover:bg-[#CC1A1A]/60 hover:text-white"
        onClick={() => {
          showRepairHistoryDetailPopup.value = true;
          showRepairHistoryDetail.value = row;
        }}
      >
        详情
      </span>
    ),
  },
];
</script>

<template>
  <DragPopup v-model:visible="visible" :width="570" left="300px" :top="100" @close="() => showRepairHistoryDetailPopup = false ">
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{ title }}</span>
        <div class="type-select">
          <label>
            <input v-model="type" name="RepairBuildPopupType" type="radio" class="hidden" value="1">
            <span>日常修缮</span>
          </label>
          <label>
            <input v-model="type" name="RepairBuildPopupType" type="radio" class="hidden" value="2">
            <span>规模修缮</span>
          </label>
        </div>
      </div>
    </template>
    <div class="px-10 space-y-2">
      <UiThirdTitle title="正在修缮项目信息" />
      <!-- <template #extra>
          <StatusTag status="立项" />
        </template> -->
      <component :is="DescriptionComponentMap[type]" :data="state.info" />
      <UiThirdTitle title="修缮历史列表" />
      <UiEasyTable
        :columns="tableColumns" :data="state.history" height="200" />
    </div>

    <RepairHistoryDetailPopup v-model:visible="showRepairHistoryDetailPopup" :title="title" :data="showRepairHistoryDetail" />
  </DragPopup>
</template>

<style scoped lang="scss">
.type-select {
  label {
    color: #9e9e9e;
    font-size: 12px;
    cursor: pointer;
    font-family: AlibabaPuHuiTi-3-medium;
    padding: 3px 8px;
    &:hover {
      color: #ffd1b0;
    }

    & + label {
      margin-left: 8px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        width: 1px;
        height: 10px;
        background: #b1b1b1;
        top: calc(50% - 5px);
        left: -4px;
      }
    }

    &:has(input:checked) {
      color: #ffd1b0;
      --border-color: #ff9a3b;
      background:
        linear-gradient(to right, var(--border-color), var(--border-color)) no-repeat left top / 100% 1px,
        linear-gradient(
            to bottom,
            var(--border-color),
            var(--border-color) calc(50% - 2px),
            transparent calc(50% - 2px),
            transparent calc(50% + 2px),
            var(--border-color) calc(50% + 2px),
            var(--border-color)
          )
          no-repeat left top / 1px 100%,
        linear-gradient(
            to bottom,
            var(--border-color),
            var(--border-color) calc(50% - 2px),
            transparent calc(50% - 2px),
            transparent calc(50% + 2px),
            var(--border-color) calc(50% + 2px),
            var(--border-color)
          )
          no-repeat right top / 1px 100%,
        linear-gradient(to right, var(--border-color), var(--border-color)) no-repeat left bottom / 100% 1px,
        rgba(#000000, 0.3);
    }
  }
}
</style>
