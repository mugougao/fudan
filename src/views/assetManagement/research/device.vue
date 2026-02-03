<script setup lang="ts">
import type ViewPanel from "@/components/ViewPanel/index.vue";
import to from "await-to-js";
import { fetchInstrumentDetail, fetchInstrumentList } from "@/api/assetManagement/research";
import DeviceInfo from "./components/DeviceInfo/index.vue";
import DeviceUseInfo from "./components/DeviceUseInfo/index.vue";

const router = useRouter();
const showShareInfo = ref(false);

function returnClick() {
  router.back();
}

const viewPanelRef = useTemplateRef<InstanceType<typeof ViewPanel>>("viewPanel");
const showDeviceListPopup = ref(true);

const { state: deviceList } = useAsyncState(
  async () => {
    const [err, res] = await to(fetchInstrumentList());
    if (err || !res?.success) return [];
    return res?.resultData || [];
  },
  [],
  { immediate: true },
);

const { state: deviceDetail, execute: executeDeviceDetail } = useAsyncState(
  async (id: string) => {
    const [err, res] = await to(fetchInstrumentDetail(id));
    if (err || !res?.success) return {};
    return res?.resultData || {};
  },
  {},
  { immediate: false },
);

function deviceListClick(id) {
  executeDeviceDetail(0, id);
  viewPanelRef.value?.showPanel();
}
</script>

<template>
  <UiViewPanel ref="viewPanel" :default-show-data-panel="false" show-return @custom-return="returnClick">
    <template #left>
      <UiBoxPanel title="电镜中心概览" class="row-span-24" content-class-name="px-3">
        <template #titleSuffix>
          <UiSelectBtn v-model="showShareInfo">
            共享情况
          </UiSelectBtn>
        </template>
        <DeviceInfo :desc="deviceDetail.sbjs" :images="deviceDetail.fileList" :data="deviceDetail" />
      </UiBoxPanel>
    </template>
    <template #right>
      <UiBoxPanel title="使用数据" class="row-span-14">
        <DeviceUseInfo :data="deviceDetail" />
      </UiBoxPanel>
    </template>
  </UiViewPanel>

  <DragPopup v-model:visible="showDeviceListPopup" title="设备列表" width="380px" :top="100" left="calc(100% - 800px)">
    <div v-for="({ id, sbmc }) in deviceList" :key="id">
      <div
        class="cursor-pointer truncate rounded px-3 py-1.5 text-[14px] text-white/80 hover:bg-gray-100/10 hover:text-white"
        @click="deviceListClick(id)">
        {{ sbmc }}
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
