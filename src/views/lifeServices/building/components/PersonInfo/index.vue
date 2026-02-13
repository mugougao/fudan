<script setup lang="tsx">
import type { Ref } from "vue";
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";
import { useRouteQuery } from "@vueuse/router";
import { useI18n } from "vue-i18n";
import dormitoryRoomStatusRangeLayer from "@/utils/WdpMap/lifeServices/DormitoryRoomStatusRangeLayer.ts";
import PersonInfoCount from "../PersonInfoCount/index.vue";
import PersonInfoTypeChart from "../PersonInfoTypeChart/index.vue";

defineOptions({ name: "PersonInfo" });
const { statistics = {}, education = [], sex = [], department = [] } = defineProps<{
  statistics: Record<string, any>;
  education: any[];
  sex: any[];
  department: any[];
}>();
const emits = defineEmits<{
  occupancyDistributionChange: [checked: boolean];
}>();
const { t, tm } = useI18n();
// 楼栋 ID
const buildId = useRouteQuery("buildId") as unknown as Ref<string>;

const occupancyDistributionOpen = ref(false);

watch(
  occupancyDistributionOpen,
  (val) => {
    console.log("🔘 [入住率按钮] 状态变化:", {
      新状态: val ? "打开" : "关闭",
      楼栋ID: buildId.value,
    });
    if (val) {
      console.log("🎨 [入住率按钮] 调用 render...");
      dormitoryRoomStatusRangeLayer.render(buildId.value);
    }
    else {
      console.log("🧹 [入住率按钮] 调用 remove...");
      dormitoryRoomStatusRangeLayer.remove();
    }
    emits("occupancyDistributionChange", val);
  },
  { immediate: true }, // 初始化时立即执行一次
);
function closeOccupancyDistributionOpen() {
  occupancyDistributionOpen.value = false;
}

const tableColumns: IEasyTableProps["columns"] = [
  { title: "院系", field: "name", align: "center" },
  { title: () => {
    return (
      <span>
        人数
        <span class="text-[10px] text-white/50 font-text">(人)</span>
      </span>
    );
  }, field: "value", width: 80, align: "center", className: "font-number text-[14px]" },
  {
    title: "占比",
    field: "percent",
    width: 80,
    align: "center",
    className: "bg-gradient-to-b from-red font-number to-white text-transparent bg-clip-text text-[14px]",
    render: ({ value }) => `${value}%`,
  },
];

defineExpose({
  closeOccupancyDistributionOpen,
});
</script>

<template>
  <UiBoxPanel class="row-span-17" title-path="dormitory.build.personnelInformation" content-class-name="flex flex-col">
    <UiSwitch v-model="occupancyDistributionOpen" class="mb-1 self-end">
      {{ $t('dormitory.build.occupancyRate') }}
    </UiSwitch>

    <PersonInfoCount :data="statistics" />
    <PersonInfoTypeChart :qualification="education" :gender="sex" />
    <div class="flex-auto overflow-hidden px-2 pb-2">
      <UiEasyTable
        :columns="tableColumns" :data="department" />
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
