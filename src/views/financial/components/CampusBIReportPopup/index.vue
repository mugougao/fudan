<script setup lang="ts">
import type { IEasyTableProps } from "@/components/EasyTable/index.vue";

defineOptions({ name: "CampusBIReportPopup", inheritAttrs: false });

const visible = defineModel<boolean>("visible", { default: false });

const columns: IEasyTableProps["columns"] = [
  { title: "序号", field: "index", width: 40, align: "center" },
  { title: "资产编号", field: "assetCode", align: "center" },
  { title: "资产名称", field: "assetName", align: "center" },
  { title: "财务入账日期", field: "entryDate", align: "center" },
  { title: "原值", field: "rawValue", align: "center" },
  { title: "折旧年限", field: "depreciationPeriod", align: "center" },
  { title: "累计折旧", field: "accumulatedDepreciation", align: "center" },
  { title: "已折旧月数", field: "monthsHasBeenDepreciated", align: "center" },
  { title: "月折旧额", field: "monthlyDepreciation", align: "center" },
  { title: "净值", field: "netWorth", align: "center" },
  { title: "校区", field: "campus", align: "center" },
  { title: "楼宇", field: "building", align: "center" },
  { title: "部门", field: "department", align: "center" },
  { title: "使用状况", field: "usageStatus", align: "center" },
];

const data = Array.from({ length: 10 }, (_, i) => ({
  index: i + 1,
  assetCode: `资产编号${i + 1}`,
  assetName: `资产名称${i + 1}`,
  entryDate: "2023-01-01",
  rawValue: `原值${i + 1}`,
  depreciationPeriod: `折旧年限${i + 1}`,
  accumulatedDepreciation: `累计折旧${i + 1}`,
  monthsHasBeenDepreciated: `已折旧月数${i + 1}`,
  monthlyDepreciation: `月折旧额${i + 1}`,
  netWorth: `净值${i + 1}`,
  campus: `校区${i + 1}`,
  building: `楼宇${i + 1}`,
  department: `部门${i + 1}`,
  usageStatus: `使用状况${i + 1}`,
}));

const page = ref({
  current: 1,
  pageSize: 10,
  total: 100,
});
</script>

<template>
  <DragPopup v-model:visible="visible" title="资产BI报表" :width="1200" left="auto" :top="100">
    <AForm :colon="false" size="small" layout="inline" class="!mb-2 children:!flex-1">
      <AFormItem label="校区">
        <ASelect placeholder="请选择校区" />
      </AFormItem>
      <AFormItem label="楼宇">
        <ASelect placeholder="请选择楼宇" />
      </AFormItem>
      <AFormItem label="院系">
        <ASelect placeholder="请选择院系" />
      </AFormItem>
      <AFormItem label="经费本">
        <ASelect placeholder="请选择经费本" />
      </AFormItem>
    </AForm>
    <ThirdTitle>信息详情</ThirdTitle>
    <div class="px-2 pt-3">
      <EasyTable
        :columns="columns" :data="data"
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
