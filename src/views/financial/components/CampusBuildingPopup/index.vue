<script setup lang="tsx">
import to from "await-to-js";
import dayjs from "dayjs";
import { fetchBuildingCountDetailInfoById, fetchBuildingCountInfoById } from "@/api/financial/index.ts";
import AssetInfo from "./AssetInfo.vue";
import ElectricInfo from "./ElectricInfo.vue";
import OverviewItem from "./OverviewItem.tsx";
import RepairInfo from "./RepairInfo.vue";
import WaterInfo from "./WaterInfo.vue";

defineOptions({ name: "CampusBuildingPopup", inheritAttrs: false });

const { id, title } = defineProps<{
  id?: string;
  title?: string;
}>();
const visible = defineModel<boolean>("visible", { default: false });

const { state, execute } = useAsyncState(
  async () => {
    if (!id) return {};

    const [
      [,res1],
      [,res2],
    ] = await Promise.all([
      to(fetchBuildingCountInfoById(id)),
      to(fetchBuildingCountDetailInfoById(id)),
    ]);

    const { zclb, nhlb, ydxx } = res2?.resultData || {};

    return {
      count: res1?.resultData || {},
      detail: {
        assets: {
          id,
          total: (zclb || []).map(({ type, jz }) => ({ name: type, value: jz })),
          money: (zclb || []).map(({ type, je }) => ({ name: type, value: je })),
        },
        electric: {
          chartData: (nhlb || []).map(({ updatetime, dayelect }) => ({ name: dayjs(updatetime).format("M/D"), value: dayelect })).reverse(),
          total: [
            { yesterday: ydxx?.dayelect, month: ydxx?.monthelect, year: ydxx?.yearelect },
            { yesterday: ydxx?.dayelectAmount, month: ydxx?.monthelectAmount, year: ydxx?.yearelectAmount },
          ],
        },
        water: {
          chartData: (nhlb || []).map(({ updatetime, dayelect }) => ({ name: dayjs(updatetime).format("M/D"), value: dayelect })).reverse(),
          total: [
            { yesterday: ydxx?.daywater, month: ydxx?.monthwater, year: ydxx?.yearwater },
            { yesterday: ydxx?.daywaterAmount, month: ydxx?.monthwaterAmount, year: ydxx?.yearwaterAmount },
          ],
        },
      },
    };
  },
  {},
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

const list = [
  {
    title: "资产",
    key: "assets",
    icon: "i-svg-icon-asset",
    options: [
      { label: "资产净值", field: "jz", unit: "万元" },
      { label: "资产数量", field: "sl", unit: "个" },
    ],
  },
  {
    title: "用电",
    key: "electric",
    icon: "i-svg-icon-electric",
    options: [
      { label: "用电费用", field: "electamount", unit: "万元" },
      { label: "用电能耗", field: "elect", unit: "Kwh" },
    ],
  },
  {
    title: "用水",
    key: "water",
    icon: "i-svg-icon-waterUse",
    options: [
      { label: "用水费用", field: "wateramount", unit: "万元" },
      { label: "用水能耗", field: "water", unit: "吨" },
    ],
  },
  {
    title: "安保",
    key: "security",
    icon: "i-svg-icon-property",
    options: [
      { label: "安保费用", field: "none", unit: "万元" },
      { label: "安保人数", field: "none", unit: "个" },
    ],
  },
  {
    title: "物业",
    key: "property",
    icon: "i-svg-icon-security",
    options: [
      { label: "物业费用", field: "none", unit: "万元" },
      { label: "物业人数", field: "none", unit: "个" },
    ],
  },
  {
    title: "楼宇修缮",
    key: "repair",
    icon: "i-svg-icon-repair",
    options: [
      { label: "修缮费用", field: "none", unit: "万元" },
    ],
  },
];

const infoComponentMap = {
  assets: AssetInfo,
  electric: ElectricInfo,
  water: WaterInfo,
  repair: RepairInfo,
};

const selectedKey = ref<string | undefined>(undefined);

const infoComponentProps = computed(() => {
  if (!selectedKey.value) return {};
  return (state.value.detail ?? {})[selectedKey.value] || {};
});
function setSelectKey(key: string | undefined) {
  if (key && !Object.keys(infoComponentMap).includes(key)) return;
  if (selectedKey.value === key) {
    selectedKey.value = undefined;
    return;
  }
  selectedKey.value = key;
}
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="title" :width="640" left="auto" :top="100"
    @close="() => {
      selectedKey = undefined;
    }">
    <UiThirdTitle title="信息总览" />
    <div class="grid grid-cols-2 mt-3 gap-x-8 gap-y-3">
      <OverviewItem
        v-for="({ title: label, options, key, icon }) in list" :key="key" :data="state.count"
        :title="label" :options="options" :checked="selectedKey === key" :icon="icon"
        :select="Object.keys(infoComponentMap).includes(key)"
        @click="setSelectKey(key)" />
    </div>
    <template v-if="selectedKey && infoComponentMap[selectedKey]">
      <component v-bind="infoComponentProps" :is="infoComponentMap[selectedKey]" />
    </template>
  </DragPopup>
</template>

<style scoped lang="scss">
:deep(.overview-item) {
  display: flex;
  background-image: url("@/assets/images_new/icon-bg.png");
  background-repeat: no-repeat;
  background-size: 64px 54px;
  background-position: -7px 0px;
  .overview-item-icon {
    display: inline-flex;
    width: 50px;
    height: 50px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
    }
  }
  .overview-item-content {
    width: calc(100% - 55px);
    margin-left: 5px;
    padding: 3px 4px;
    position: relative;
    &::after,
    &::before {
      content: "";
      position: absolute;
      top: 0;
      width: 6px;
      height: 100%;
      border: 1px #ff6363 solid;
    }
    &::after {
      right: 0px;
      border-left: none;
    }
    &::before {
      left: 0px;
      border-right: none;
    }
    & > div {
      background-color: rgba(#000a17, 0.5);
    }
  }

  &.checked {
    .overview-item-content > div {
      background: linear-gradient(97deg, rgba(204, 26, 26, 0.6) 0%, rgba(97, 16, 16, 0.12) 98%), rgba(0, 10, 23, 0.5);
    }
  }
}
</style>
