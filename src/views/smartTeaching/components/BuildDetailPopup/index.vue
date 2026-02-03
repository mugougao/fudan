<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { get, merge } from "lodash";
import { type Ref, watch } from "vue";
import { getBuildingDetail } from "@/api/smartTeaching";

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
  const [err, res] = await to(getBuildingDetail(buildId.value));
  if (err) return {};
  return res?.resultData || {};
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
