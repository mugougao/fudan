<script setup lang="ts">
import type { IEasyTableProps } from "@/components/ui/EasyTable/index.vue";

defineOptions({ name: "FocusOnStudentInfo" });

const { personWarn = { count: 0, list: [] } } = defineProps<{
  personWarn?: { count: number; list: any[] };
}>();

const personWarnColumns: IEasyTableProps["columns"] = [
  { title: "学号", field: "xh", align: "center", ellipsis: true },
  { title: "姓名", field: "xm", align: "center", ellipsis: true },
  { title: "手机号", field: "sjhm", align: "center", ellipsis: true },
  { title: "房间号", field: "fjmc", align: "center", ellipsis: true },
  { title: "院系", field: "yx", align: "center", ellipsis: true },
];

const earlyWarning = ref(false);
const earlyWarningInfo = ref<any>({});
function earlyWarningClick(params: any) {
  earlyWarning.value = true;
  earlyWarningInfo.value = params.row;
}
</script>

<template>
  <UiBoxPanel
    class="row-span-7" :title="$t('dormitory.build.personnelWarn')"
    content-class-name="flex flex-col">
    <template #titleSuffix>
      <span class="empty-number ml-2 border border-[#CC1A1A] rounded-2xl from-[#CC1A1A] to-[#CC1A1A]/0 bg-gradient-to-b px-1.5 text-[16px] font-number">{{ personWarn.count || 0 }}</span>
    </template>
    <div class="flex-auto overflow-hidden">
      <UiEasyTable :columns="personWarnColumns" :data="personWarn.list" @row-click="earlyWarningClick" />
    </div>

    <!--  预警弹窗  -->
    <DragPopup v-model:visible="earlyWarning" title="预警人员详情" width="260px" top="750" left="calc(100% - 620px)">
      <ul class="text-[14px] space-y-1 [&>li>span:first-child]:text-white/80 [&>li>span:last-child]:text-white">
        <li>
          <span>姓名：</span>
          <span>{{ earlyWarningInfo?.xm }}</span>
        </li>
        <li>
          <span>学号：</span>
          <span>{{ earlyWarningInfo?.xh }}</span>
        </li>
        <li>
          <span>房间号：</span>
          <span>{{ earlyWarningInfo?.fjmc }}</span>
        </li>
        <li>
          <span>手机号：</span>
          <span>{{ earlyWarningInfo?.phone || '暂无' }}</span>
        </li>
        <li>
          <span>院系：</span>
          <span>{{ earlyWarningInfo?.yx }}</span>
        </li>
      </ul>
    </DragPopup>
  </UiBoxPanel>
</template>

<style scoped lang="scss">

</style>
