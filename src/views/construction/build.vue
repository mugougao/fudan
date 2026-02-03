<script setup lang="tsx">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import to from "await-to-js";
import { deleteBuild } from "@/api/construction/build";
import { useBuildList, useBuildListParamsOptions } from "@/composables/construction/build";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer";
import campusRangeLayer from "@/utils/WdpMap/CampusRangeLayer";
import buildMgrPoiLayer from "@/utils/WdpMap/construction/BuildMgrPoiLayer";
import wdpMap from "@/utils/WdpMap/wdpMap";
import EditBuildPopup from "./components/EditBuildPopup/index.vue";

const { activeCampusId, setActiveCampusId } = useCampusStore();

const { areaOptions, typeOptions } = useBuildListParamsOptions();
const { params, list, current, total, search, execute: executeBuildList } = useBuildList();

function updatePoints() {
  buildMgrPoiLayer.render(activeCampusId, params.value);
}

const showEditBuildPopup = ref(false);
const readonlyEditBuildPopup = ref(false);
const buildPopupId = ref("");

function editBuildHandler(id?: string) {
  showEditBuildPopup.value = true;
  readonlyEditBuildPopup.value = false;
  buildPopupId.value = id || "";
}

async function detailsBuildHandler(id: string) {
  buildMgrPoiLayer.focus(id);
  showEditBuildPopup.value = true;
  readonlyEditBuildPopup.value = true;
  buildPopupId.value = id || "";
}
async function deleteHandler(id: string) {
  await window.$confirm({ title: "删除操作", content: "确定删除该数据吗？" });
  const [err, res] = await to(deleteBuild(id));
  if (err || !res.success) {
    window.$message.error("删除失败");
    return;
  }
  window.$message.success("删除成功");
  executeBuildList();
  buildMgrPoiLayer.remove(id);
}

function searchHandler() {
  search();
  updatePoints();
}

onMounted(() => {
  setActiveCampusId(CampusId.HanDan);
  wdpMap.addLayer(buildMgrPoiLayer);
  wdpMap.onCreated(() => {
    // 默认 邯郸校区视角
    campusPoiLayer.hideAll();
    setActiveCampusId(CampusId.HanDan);
    campusRangeLayer.focusByCampusId(CampusId.HanDan);
    updatePoints();
    buildMgrPoiLayer.onClick(({ id }) => {
      detailsBuildHandler(id);
    });
  });
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(buildMgrPoiLayer);
  campusPoiLayer.showAll();
});

watch(
  () => activeCampusId,
  () => {
    updatePoints();
  },
);

const columns: IEasyTableProps["columns"] = [
  { title: "楼宇名称", field: "name", align: "center" },
  { title: "所属园区", field: "area", align: "center" },
  {
    title: "点位详情",
    field: "name",
    align: "center",
    render: ({ row }) => {
      return (
        <span class="space-x-1">
          <span
            class="group size-[15px] inline-flex items-center justify-center rounded-[2px] hover:bg-white/10"
            onClick={() => detailsBuildHandler(row.id)}
          >
            <i class="i-ri-map-pin-2-fill group-hover:from-[#FFC2C2] group-hover:to-white group-hover:bg-gradient-to-b"></i>
          </span>
          <span
            class="group size-[15px] inline-flex items-center justify-center rounded-[2px] hover:bg-white/10"
            onClick={() => editBuildHandler(row.id)}
          >
            <i class="i-ri-edit-2-fill group-hover:from-[#FFC2C2] group-hover:to-white group-hover:bg-gradient-to-b"></i>
          </span>
          <span
            class="group size-[15px] inline-flex items-center justify-center rounded-[2px] hover:bg-white/10"
            onClick={() => deleteHandler(row.id)}
          >
            <i class="i-ri-delete-bin-5-fill group-hover:from-[#FFC2C2] group-hover:to-white group-hover:bg-gradient-to-b"></i>
          </span>
        </span>
      );
    },

  },
];
</script>

<template>
  <UiViewPanel>
    <template #left>
      <UiBoxPanel title="楼宇管理" class="row-span-19" content-class-name="space-y-1">
        <AForm size="small" class="children:!mb-1">
          <AFormItem name="name">
            <div class="flex gap-1">
              <AInput v-model:value="params.name" placeholder="请输入楼宇名称" @press-enter="() => searchHandler()">
                <template #prefix>
                  <i class="i-ri-search-2-line" />
                </template>
              </AInput>
              <button
                type="button"
                class="add-btn size-[24px] flex shrink-0 items-center justify-center border border-[#CC1A1A] rounded-[2px] bg-transparent from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent via-80% text-white !bg-gradient-to-b"
                @click="() => editBuildHandler()">
                <i class="i-ri-add-line" />
              </button>
            </div>
          </AFormItem>
          <AFormItem name="area">
            <ASelect
              v-model:value="params.area" :options="areaOptions" class="area" placeholder="请选择园区" allow-clear
              @change="() => searchHandler()" />
          </AFormItem>
          <AFormItem name="type">
            <ASelect
              v-model:value="params.type" :options="typeOptions" class="type" placeholder="请选择楼宇类别" allow-clear
              @change="() => searchHandler()" />
          </AFormItem>
        </AForm>
        <div class="h-[500px]">
          <UiEasyTable :columns="columns" :data="list" />
        </div>
        <div class="h-[40px]">
          <APagination v-model:current="current" class="!text-center" simple :total="total" />
        </div>
      </UiBoxPanel>
    </template>
  </UiViewPanel>

  <EditBuildPopup
    :id="buildPopupId" v-model:visible="showEditBuildPopup" v-model:readonly="readonlyEditBuildPopup"
    @refresh="() => {
      updatePoints();
      executeBuildList();
    }" />
</template>

<style scoped lang="scss">
:deep(.ant-select) {
  .ant-select-selector {
    &::before {
      content: "";
      display: block;
      width: 15px;
      height: 15px;
      background-image: icon("i-ri-hotel-fill", "#ffe5e566");
      font-size: 12px;
      background-size: 12px 12px;
      background-position: center;
      background-repeat: no-repeat;
      margin-top: 3px;
      margin-right: 3px;
    }
  }
  &.type {
    .ant-select-selector {
      &::before {
        background-image: icon("i-ri-building-4-fill", "#ffe5e566");
      }
    }
  }
}

:deep(.ant-pagination.ant-pagination-simple) {
  li {
    &.ant-pagination-prev,
    &.ant-pagination-next {
      background-color: transparent !important;
      border: 1px solid transparent !important;
    }

    &.ant-pagination-simple-pager {
      color: white !important;
      input {
        background-color: rgba(#ffffff, 0.05) !important;
        border: 1px solid transparent !important;
      }
    }
  }
}
</style>
