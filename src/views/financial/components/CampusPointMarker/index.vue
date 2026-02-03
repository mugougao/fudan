<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { CampusId } from "@/enums";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer";
import baseFacilitiesBankPoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesBankPoiLayer.ts";
import baseFacilitiesDeliveryMachinePoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesDeliveryMachinePoiLayer.ts";
import baseFacilitiesSelfServicePrintersPoiLayer from "@/utils/WdpMap/financial/BaseFacilitiesSelfServicePrintersPoiLayer.ts";

defineOptions({ name: "CampusPointMarker", inheritAttrs: false });

const campusId = useRouteQuery("campusId", CampusId.HanDan);

const checkedMap = ref({
  bank: false, //  银行
  post: false, // 投递机
  card: false, // 补卡机
});

watch(
  () => Object.values(checkedMap.value).some(Boolean),
  (val) => {
    val ? campusPoiLayer.hideAll() : campusPoiLayer.showAll();
  },
);

function handleChange(checked: boolean, type: string) {
  switch (type) {
    case "银行":
      checked
        ? baseFacilitiesBankPoiLayer.render(campusId.value)
        : baseFacilitiesBankPoiLayer.removeAll();
      break;
    case "自助报账投递机":
      checked
        ? baseFacilitiesDeliveryMachinePoiLayer.render(campusId.value)
        : baseFacilitiesDeliveryMachinePoiLayer.removeAll();
      break;
    case "自助补卡机":
      checked
        ? baseFacilitiesSelfServicePrintersPoiLayer.render(campusId.value)
        : baseFacilitiesSelfServicePrintersPoiLayer.removeAll();
      break;
  }
}
</script>

<template>
  <UiBoxPanel title-path="financial.index.pointMark" class="row-span-5">
    <div class="flex justify-evenly">
      <span class="flex flex-col items-center text-[14px]">
        <span class="icon-box">
          <i class="i-svg-icon-raw-bank" />
        </span>
        <span class="text-white/80">{{ $t('financial.index.campusBank') }}</span>
        <UiSwitch v-model="checkedMap.bank" @change="(checked) => handleChange(checked as boolean, '银行')" />
      </span>
      <span class="flex flex-col items-center text-[14px]">
        <span class="icon-box">
          <i class="i-svg-icon-raw-machine" />
        </span>
        <span class="text-white/80">{{ $t('financial.index.selfServiceBillingMachine') }}</span>
        <UiSwitch v-model="checkedMap.post" @change="(checked) => handleChange(checked as boolean, '自助报账投递机')" />
      </span>
      <span class="flex flex-col items-center text-[14px]">
        <span class="icon-box">
          <i class="i-svg-icon-raw-service" />
        </span>
        <span class="text-white/80">{{ $t('financial.index.selfServiceCardMachine') }}</span>
        <UiSwitch v-model="checkedMap.card" @change="(checked) => handleChange(checked as boolean, '自助补卡机')" />
      </span>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 41px;
  background: url("@/assets/images_new/icon-bg-box.png");
  margin-bottom: 5px;
  & + span {
    margin-bottom: 15px;
  }
}
</style>
