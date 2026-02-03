<script setup lang="ts">
import type { IEasyTableProps } from "@/components/EasyTable/index.vue";
import to from "await-to-js";
import { exportBuildingAssetsDetail, fetchBuildingAssetsDetail, fetchBuildingAssetsDetailFilter } from "@/api/financial/index.ts";
import { useState } from "@/hooks";

defineOptions({ name: "AssetInfoDetailPopup", inheritAttrs: false });

const { buildingId } = defineProps<{
  buildingId?: string;
}>();
const visible = defineModel<boolean>("visible", { default: false });
const {
  state: filterData,
  execute: filterDataExecute,
} = useAsyncState(
  async () => {
    if (!buildingId) return {};
    const [,res] = await to(fetchBuildingAssetsDetailFilter(buildingId));
    return Object.entries(res?.resultData || {}).reduce(
      (prev, [key, values]) => {
        prev[key] = values.map(str => ({ label: str, value: str }));
        return prev;
      },
      {} as Record<string, { label: string; value: string }[]>,
    );
  },
  {},
  { immediate: false, resetOnExecute: false },
);

const [formData,,restFormData] = useState({ zcbh: "", bgr: undefined, glbm: undefined, cfd: undefined });

const [page,,restPage] = useState({ current: 1, pageSize: 10, total: 0 });

const { state, execute } = useAsyncState(
  async () => {
    if (!buildingId) return [];
    const [,res] = await to(fetchBuildingAssetsDetail({
      id: buildingId,
      pageNum: page.value.current,
      pageSize: page.value.pageSize,
      ...formData.value,
    }));
    const list = res?.resultData?.list || [];
    page.value.total = res?.resultData?.total || 0;
    return list;
  },
  [],
  { immediate: false, resetOnExecute: false },
);

// 导出
function exportData() {
  if (!buildingId) return;
  exportBuildingAssetsDetail({ id: buildingId, ...formData.value });
}

watch(
  () => [buildingId, visible.value],
  () => {
    if (visible.value && buildingId) {
      filterDataExecute();
      execute();
    }
  },
);

watch(
  () => [page.value.current, page.value.pageSize],
  () => {
    if (!visible.value) return;
    execute();
  },
);

const columns: IEasyTableProps["columns"] = [
  { title: "资产编号", field: "zcbh", align: "center" },
  { title: "资产名称", field: "zcmc", align: "center" },
  { title: "原值", field: "yz", align: "center" },
  { title: "净值", field: "jz", align: "center" },
  { title: "管理部门", field: "glbm", align: "center" },
  { title: "存放地", field: "cfd", align: "center", ellipsis: true },
];
function filterOption(input: string, option: any) {
  return option.label.includes(input);
}
</script>

<template>
  <DragPopup
    v-model:visible="visible" title="资产报表" :width="1000" left="auto" :top="100"
    :auto-prev-popup="false" @close="() => {
      restPage();
      restFormData();
    }">
    <AForm :colon="false" size="small" layout="inline" class="!mb-2">
      <AFormItem label="资产编号" class="flex-1">
        <AInput v-model:value="formData.zcbh" placeholder="请输入资产编号" @press-enter="() => execute()" />
      </AFormItem>
      <AFormItem label="保管人" class="flex-1">
        <ASelect
          v-model:value="formData.bgr"
          class="!w-[140px]" placeholder="请选择保管人" allow-clear :options="filterData.bgrxm ?? []"
          show-search :filter-option="filterOption" @change="() => execute()" />
      </AFormItem>
      <AFormItem label="管理部门" class="flex-1">
        <ASelect
          v-model:value="formData.glbm"
          class="!w-[140px]" placeholder="请选择管理部门" allow-clear :options="filterData.ejdw ?? []"
          show-search :filter-option="filterOption" @change="() => execute()" />
      </AFormItem>
      <AFormItem label="存放地" class="flex-1">
        <ASelect
          v-model:value="formData.cfd"
          class="!w-[140px]" placeholder="请选择存放地" allow-clear :options="filterData.cfd ?? []"
          show-search :filter-option="filterOption" @change="() => execute()" />
      </AFormItem>
      <AFormItem class="w-[50px]">
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center border border-[#20566C] rounded bg-[#20566C]/20 px-2 py-1.5 text-white leading-none"
          @click="exportData">
          导出
        </button>
      </AFormItem>
    </AForm>

    <div class="px-2 pt-3">
      <EasyTable
        :columns="columns" :data="state"
        header-class-name="text-[12px] font-text-medium"
        row-cell-class-name="text-[12px] font-text" />
      <APagination
        v-model:current="page.current"
        v-model:page-size="page.pageSize"
        size="small"
        :show-size-changer="false"
        show-quick-jumper
        :total="page.total"
        :show-total="(total:number) => `共${total}条记录`" />
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
