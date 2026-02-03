<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import to from "await-to-js";
import { addBuild, fetchBuildDetail, updateBuild } from "@/api/construction/build";
import { useBuildListParamsOptions } from "@/composables/construction/build";
import { campusIdToName, campusNameToId, cumpusOptions } from "@/enums";
import { useState } from "@/hooks";
import { useCampusStore } from "@/stores/campus";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "EditBuildPopup", inheritAttrs: false });

const { id } = defineProps<{
  id?: string;
}>();

const emits = defineEmits<{
  refresh: [];
}>();

const visible = defineModel<boolean>("visible", { default: false });
const readonly = defineModel<boolean>("readonly", { default: false });

const { activeCampusId, setActiveCampusId } = useCampusStore();
const { areaOptions, typeOptions } = useBuildListParamsOptions();

const levelOptions = [
  { label: "1级", value: 1 },
  { label: "2级", value: 2 },
  { label: "3级", value: 3 },
];

const formRef = useTemplateRef<FormInstance>("form");
const title = computed(() => {
  if (readonly.value) return "楼宇详情";
  return id ? "编辑楼宇" : "新增楼宇";
});
const [formData,,restFormData] = useState<any>(() => ({
  xq: undefined,
  name: "",
  area: undefined,
  type: "",
  level: undefined,
  xy: "",
}));

const autoTypeOptions = ref<any[]>([]);
function getAutoTypeOptions(searchText: string) {
  if (!searchText) {
    autoTypeOptions.value = typeOptions.value;
    return;
  }
  const result = typeOptions.value.filter(item => item.value.includes(searchText));
  if (!result.length) {
    autoTypeOptions.value = [{ value: searchText, label: searchText }];
  }
  autoTypeOptions.value = result;
}

watch(
  visible,
  () => {
    if (!wdpMap.app) return;
    wdpMap.app.Tools.PickerPoint.EndPickPoint();
    wdpMap.app.DataModel.Geometry.EndShowCoord();
  },
);

watch(
  () => [visible.value, id],
  async (val) => {
    if (!val) {
      formRef.value?.resetFields();
      restFormData();
    }
    else {
      if (!id) {
        formRef.value?.resetFields();
        restFormData();
        formData.value.xq = activeCampusId;
      }
      else {
        const [err, res] = await to(fetchBuildDetail(id));
        if (err || !res.success) return;
        const { area, level, name, xq, type, xy } = res.resultData || [];
        formData.value = {
          xq: campusNameToId(xq),
          name,
          area,
          type,
          level,
          xy,
        };
      }
    }
  },
);

async function setPoint() {
  if (!wdpMap.app) {
    window.$message.warning("选择点位失败");
    return;
  }
  const { success, result: { pickedPoints } } = await wdpMap.app.Tools.PickerPoint.GetPickedPoints("surface");
  if (!success || !pickedPoints.length) {
    window.$message.warning("选择点位失败");
    return;
  }
  formData.value.xy = (pickedPoints[0] as any[]).slice(0, 2).join(",");
  wdpMap.app.Tools.PickerPoint.EndPickPoint();
  wdpMap.app.DataModel.Geometry.StartShowCoord(pickedPoints, "surface");
  document.removeEventListener("click", setPoint);
}

async function pickerPointHandler() {
  window.$message.info("请在地图中点击选择楼点位");
  if (!wdpMap.app) {
    window.$message.warning("选择点位失败");
    return;
  }
  wdpMap.app.Tools.PickerPoint.EndPickPoint();
  wdpMap.app.DataModel.Geometry.EndShowCoord();
  const res = await wdpMap.app.Tools.PickerPoint.StartPickPoint(true, true, "surface"); ;
  if (!res.success) {
    window.$message.warning("选择点位失败");
    return;
  }
  document.addEventListener("click", setPoint);
}

async function submitHandler() {
  await formRef.value?.validate();
  const xq = campusIdToName(formData.value.xq);
  const [err, res] = await to(id ? updateBuild({ id, ...formData.value, xq }) : addBuild({ ...formData.value, xq }));
  if (err || !res.success) {
    window.$message.error(id ? "修改失败" : "添加失败");
    return;
  }
  window.$message.success(id ? "修改成功" : "添加成功");
  visible.value = false;
  emits("refresh");
}

const columns: any[] = [
  { label: "所属校区", field: "xq", render: ({ value }) => campusIdToName(value) },
  { label: "所属园区", field: "area" },
  { label: "楼宇名称", field: "name" },
  { label: "楼宇用途", field: "type" },
  { label: "楼展示层级", field: "level", render: ({ value }) => levelOptions.find(item => item.value === value)?.label },
];
</script>

<template>
  <DragPopup
    v-model:visible="visible"
    :title="title" :width="360" left="calc(100% - 700px)" :top="200">
    <div v-show="readonly">
      <Descriptions
        :columns="columns" :data="formData"
        label-class-name="text-[14px]"
        content-class-name="text-[14px]"
        item-class-name="mb-2" />
      <div class="text-center">
        <button
          class="border border-[#CC1A1A] rounded bg-transparent from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent via-80% bg-gradient-to-b px-5 py-0.5 text-white"
          @click="readonly = false">
          编辑楼宇
        </button>
      </div>
    </div>

    <div v-show="!readonly">
      <AForm ref="form" :model="formData" class="children:!mb-2" :label-col="{ style: { width: '80px' } }">
        <AFormItem label="所属校区" name="xq" required>
          <ASelect v-model:value="formData.xq" placeholder="请选择所属校区" :options="cumpusOptions" />
        </AFormItem>
        <AFormItem label="所属园区" name="area" required>
          <ASelect v-model:value="formData.area" :options="areaOptions" placeholder="请选择所属园区" />
        </AFormItem>
        <AFormItem label="楼宇名称" name="name" required>
          <AInput v-model:value="formData.name" placeholder="请输入楼宇名称" />
        </AFormItem>
        <AFormItem label="楼宇用途" name="type" required>
          <AAutoComplete v-model:value="formData.type" placeholder="请输入楼宇用途" :options="autoTypeOptions" @search="getAutoTypeOptions" />
        </AFormItem>
        <AFormItem label="展示层级" name="level" required>
          <ASelect v-model:value="formData.level" :options="levelOptions" placeholder="请选择展示层级" />
        </AFormItem>
        <AFormItem label="楼点位" name="xy" required>
          <div class="flex items-center gap-1">
            <AInput v-model:value="formData.xy" readonly placeholder="请输入楼宇名称" />
            <button
              type="button"
              class="shrink-0 border border-[#CC1A1A] rounded bg-transparent from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent via-80% px-1 py-0.5 text-white !bg-gradient-to-b"
              @click="pickerPointHandler">
              拾取点位
            </button>
          </div>
        </AFormItem>
        <AFormItem>
          <div class="flex items-center justify-center gap-5">
            <button
              class="border border-[#CC1A1A] rounded bg-transparent from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent via-80% bg-gradient-to-b px-5 py-0.5 text-white"
              @click="submitHandler">
              保存
            </button>
            <button
              class="border border-white rounded bg-transparent from-white/20 via-white/75 to-transparent via-80% bg-gradient-to-b px-5 py-0.5 text-white"
              @click="visible = false">
              取消
            </button>
          </div>
        </AFormItem>
      </AForm>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">
</style>
