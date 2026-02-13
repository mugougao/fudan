<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import { get, merge } from "lodash";
import { type Ref, watch } from "vue";

defineOptions({ name: "BuildDetailPopup" });

const emits = defineEmits<{
  close: [];
  rateClick: [data: { name: string; value: number | string }[]];
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

// 当前楼栋
const buildId = useRouteQuery<string>("buildId", "") as unknown as Ref<string>;

// 数据
const { state, execute } = useAsyncState<Record<string, any>>(async () => {
  if (!buildId.value) return {};

  // 硬编码楼栋详情数据
  const buildingDetailData: Record<string, any> = {
    141: { // H6教学楼
      jsmc: "H6教学楼",
      jszs: 45,
      sybl: 78.5,
      dtsyl: [
        { name: "8:00", value: 25 },
        { name: "9:00", value: 45 },
        { name: "10:00", value: 65 },
        { name: "11:00", value: 78 },
        { name: "12:00", value: 40 },
        { name: "13:00", value: 55 },
        { name: "14:00", value: 72 },
        { name: "15:00", value: 80 },
        { name: "16:00", value: 65 },
        { name: "17:00", value: 45 },
        { name: "18:00", value: 30 },
        { name: "19:00", value: 25 },
      ],
    },
    140: { // H5教学楼
      jsmc: "H5教学楼",
      jszs: 38,
      sybl: 72.3,
      dtsyl: [
        { name: "8:00", value: 20 },
        { name: "9:00", value: 40 },
        { name: "10:00", value: 60 },
        { name: "11:00", value: 72 },
        { name: "12:00", value: 35 },
        { name: "13:00", value: 50 },
        { name: "14:00", value: 68 },
        { name: "15:00", value: 75 },
        { name: "16:00", value: 60 },
        { name: "17:00", value: 40 },
        { name: "18:00", value: 25 },
        { name: "19:00", value: 20 },
      ],
    },
    144: { // JB教学楼
      jsmc: "JB教学楼",
      jszs: 32,
      sybl: 65.8,
      dtsyl: [
        { name: "8:00", value: 15 },
        { name: "9:00", value: 35 },
        { name: "10:00", value: 55 },
        { name: "11:00", value: 65 },
        { name: "12:00", value: 30 },
        { name: "13:00", value: 45 },
        { name: "14:00", value: 60 },
        { name: "15:00", value: 68 },
        { name: "16:00", value: 55 },
        { name: "17:00", value: 35 },
        { name: "18:00", value: 20 },
        { name: "19:00", value: 15 },
      ],
    },
  };

  // 返回对应楼栋的数据，如果没有则返回默认数据
  return buildingDetailData[buildId.value] || {
    jsmc: "教学楼",
    jszs: 40,
    sybl: 70.0,
    dtsyl: [
      { name: "8:00", value: 20 },
      { name: "9:00", value: 40 },
      { name: "10:00", value: 60 },
      { name: "11:00", value: 70 },
      { name: "12:00", value: 35 },
      { name: "13:00", value: 50 },
      { name: "14:00", value: 65 },
      { name: "15:00", value: 72 },
      { name: "16:00", value: 58 },
      { name: "17:00", value: 38 },
      { name: "18:00", value: 25 },
      { name: "19:00", value: 20 },
    ],
  };

  // 注释掉原来的API调用
  // const [err, res] = await to(getBuildingDetail(buildId.value));
  // if (err) return {};
  // return res?.resultData || {};
}, {}, { immediate: false, resetOnExecute: false });

// 弹窗打开时请求数据
watch(() => [visible.value, buildId.value], () => {
  if (!visible.value) return;
  if (buildId.value) execute();
}, { immediate: true });
watch(
  () => buildId.value,
  () => !buildId.value && (visible.value = false),
  { immediate: true },
);

function mergeOption(option) {
  return merge(
    option,
    {
      // grid: { left: 5, right: 60, bottom: 0, top: 30, containLabel: true },
      xAxis: {
        axisLabel: {
          formatter: name => `第${name}\n节课`,
        },
      },
    },
  );
}
</script>

<template>
  <!--  进入教学楼   -->
  <DragPopup
    v-model:visible="visible" :title="$t('smartsTeaching.buildOverview')" :width="320" top="130px" left="370px"
    @close="emits('close')">
    <ul class="pt-2 text-[12px] text-white font-text-medium [&>li>span:first-child]:mr-2 space-y-1 [&>li>span:first-child]:text-white/80 [&>li>span:last-child]:text-white">
      <li>
        <span>{{ $t('smartsTeaching.buildName') }}:</span>
        <span>{{ get(state, 'jsmc') }}</span>
      </li>
      <li>
        <span>{{ $t('smartsTeaching.roomTotal') }}:</span>
        <span>{{ get(state, 'jszs') }}</span>
      </li>
      <li>
        <span>{{ $t('smartsTeaching.currentUsage') }}:</span>
        <span class="current-usage">
          <span class="inline-block px-2 py-0.5 text-center">
            <span class="from-red to-white bg-gradient-to-b bg-clip-text text-transparent font-number">{{ get(state, 'sybl') }}%</span>
          </span>
          <HelpTipIcon>
            <span class="flex items-center whitespace-nowrap">
              <span>当前使用率</span>
              <span class="mx-1"> = </span>
              <span class="flex flex-col text-center">
                <span class="border-b"> 当前正在上课的教室数量 </span>
                <span> 教学楼教室总数 </span>
              </span>
            </span>
          </HelpTipIcon>
        </span>
      </li>
      <li>
        <span>{{ $t('smartsTeaching.currentDayUsage') }}</span>
        <div class="h-[200px]">
          <UiChartLine :data="get(state, 'dtsyl', [])" unit="%" :size="7" :merge-option="mergeOption" />
        </div>
      </li>
    </ul>
  </DragPopup>
</template>

<style scoped lang="scss">
.current-usage {
  & > span {
    background:
      radial-gradient(ellipse at 50% 120%, rgba(#cc1a1a, 0.8) 0%, transparent 50%),
      linear-gradient(to right, transparent, #e88383, transparent) no-repeat left bottom / 100% 1px;
    backdrop-filter: blur(8px);
  }
}
</style>
