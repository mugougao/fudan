<script setup lang="ts">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useI18n } from "vue-i18n";
// import DormitoryInfoSupervisor from "@/assets/images/lifeServices/building/DormitoryInfoSupervisor.jpg";

defineOptions({ name: "DormitoryInfo" });
const { baseInfo = {}, supervisorsList = [], parkCommitteeList = [] } = defineProps<{
  baseInfo?: Record<string, any>;
  supervisorsList?: any[];
  parkCommitteeList?: any[];
}>();

const { t, tm } = useI18n();

// 楼盘表 弹窗
const realEstateTableVisible = defineModel("realEstateTableVisible", { default: false });

const baseColumns = [
  { icon: "i-ri-building-fill", title: "dormitory.build.park", field: "ssqmc" },
  { icon: "i-ri-building-4-fill", title: "dormitory.build.build", field: "lymc" },
  { icon: "i-ri-home-4-fill", title: "dormitory.build.rooms", field: "fjs", unit: "间" },
  { icon: "i-ri-hotel-bed-fill", title: "dormitory.build.beds", field: "cws", unit: "个" },
];

const personColumns = [
  { icon: "i-svg-icon-administrator", title: "dormitory.build.supervisors", field: "supervisorCount" },
  // { title: "楼长", field: "buildingChief" },
  // { title: "楼层长/寝室长", field: "floorLength" },
  { icon: "i-svg-icon-podium", title: "dormitory.build.parkCommittee", field: "parkCommitteeCount" },
];
const personInfoPopupType = ref("supervisors");
const personInfoPopupVisible = ref(false);
const personInfoTitle = computed(() => {
  const field = personColumns.find(item => item.field === personInfoPopupType.value)?.field;
  if (!field) return "";
  const tKey = {
    supervisorCount: "dormitory.build.supervisorsTitle",
    parkCommitteeCount: "dormitory.build.parkCommitteeTitle",
  };
  return t(tKey[field!]);
});

// 督导员
const tableColumns = computed<IEasyTableProps["columns"]>(() => {
  const supervisorsColumns = tm("dormitory.build.supervisorsColumns");
  return [
    { title: supervisorsColumns[0], field: "name", width: 80, align: "center" },
    { title: supervisorsColumns[1], field: "type", ellipsis: true },
    { title: supervisorsColumns[2], field: "phone", width: 120, align: "center" },
  ];
});

// 园委会成员
const Committee = computed<IEasyTableProps["columns"]>(() => {
  const parkCommitteeColumns = tm("dormitory.build.parkCommitteeColumns");
  return [
    { title: parkCommitteeColumns[0], field: "name", width: 80, align: "center" },
    { title: parkCommitteeColumns[1], field: "yx", ellipsis: true },
    { title: parkCommitteeColumns[2], field: "xh", width: 120, align: "center" },
  ];
});
</script>

<template>
  <UiBoxPanel
    title-path="dormitory.build.dormitoryInformation"
    class="row-span-6"
    content-class-name="flex flex-col px-6 justify-evenly">
    <template #titleSuffix>
      <UiSelectBtn v-model="realEstateTableVisible">
        {{ $t('dormitory.build.floorTables') }}
      </UiSelectBtn>
    </template>

    <ul class="base-count flex justify-between">
      <li
        v-for="({ title, field, unit, icon }) in baseColumns" :key="field"
        class="flex flex-col items-center">
        <span class="size-[48px] flex-col inline-flex items-center">
          <i class="mt-3 from-[#FFC2C2] to-white bg-gradient-to-b" :class="icon" />
          <span class="from-[#FFDBDB]/80 to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-title">{{ $t(title) }}</span>
        </span>
        <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[14px] text-transparent font-text-medium">
          {{ $_.get(baseInfo, field) }}{{ unit }}
        </span>
      </li>
    </ul>

    <div class="count-user flex justify-between leading-none">
      <UiCountItem
        v-for="({ field, title, icon }, index) in personColumns" :key="field"
        :name="$t(title)" :value="$_.get(baseInfo, field)" :icon="icon" unit="人"
        :type="index % 2 ? 'yellow' : 'red'" />
    </div>

    <DragPopup
      v-model:visible="personInfoPopupVisible" :title="personInfoTitle"
      :width="390" :top="100" :left="380">
      <div class="h-300px">
        <UiEasyTable
          :columns="personInfoPopupType === 'supervisorCount' ? tableColumns : Committee"
          :data="personInfoPopupType === 'supervisorCount' ? supervisorsList : parkCommitteeList" />
      </div>
    </DragPopup>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.base-count {
  li {
    span {
      &:first-child {
        background: url("@/assets/images_new/icon-bg-2.png") no-repeat center / 58px 45px;
      }
    }
  }
}

.count-user {
  background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat 48% center / 1px 100%;
}
</style>
