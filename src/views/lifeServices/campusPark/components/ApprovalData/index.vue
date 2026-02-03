<script setup lang="ts">
import { get } from "lodash";
import ApprovalDataDetailsPopup from "../ApprovalDataDetailsPopup/index.vue";

const props = defineProps<{
  countnum?: number;
  checknum?: number;
}>();

const detailsVisible = ref(false);
// checkOut
const columns = [
  { name: "审批", title: "昨日完成审批事项", field: "countnum", icon: "i-svg-icon-raw-approval" },
  { name: "退宿", title: "昨日完成退宿", field: "checknum", icon: "i-svg-icon-raw-checkOut" },
];
</script>

<template>
  <UiBoxPanel
    class="row-span-4"
    title-path="dormitory.area.approvalData">
    <template #titleSuffix>
      <UiSelectBtn v-model="detailsVisible">
        审批详情
      </UiSelectBtn>
      <ApprovalDataDetailsPopup v-model:visible="detailsVisible" />
    </template>

    <ul class="area-list grid grid-cols-2 mx-2 mt-2 flex-auto gap-x-3 gap-y-0.5 overflow-hidden">
      <li
        v-for="({ title, field, name, icon }, index) in columns" :key="index"
        class="dot-border p-1.5">
        <div class="flex items-center border border-[#FFF3F3]/10 py-0.5">
          <div class="icon mx-1 ml-3 size-[50px] flex flex-col items-center justify-end">
            <i class="mb-0.5 text-[14px]" :class="[icon]" />
            <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[10px] text-transparent font-number">{{ name }}</span>
          </div>
          <div class="ml-1 flex flex-col leading-none">
            <span class="w-[4em] text-[10px]">{{ $t(title) }}</span>
            <span class="text-[20px] font-number">
              {{ get(props, field, 0) }}
              <span class="text-[10px] text-[#9E9E9E]">个</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.area-list {
  li {
    .icon {
      background: url("@/assets/images_new/icon-bg-2.png") no-repeat center;
    }
  }
}
</style>
