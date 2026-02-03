<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useI18n } from "vue-i18n";
import { CampusId } from "@/enums";
import { cn } from "@/utils";

defineOptions({ name: "AssetMaturityDistribution" });

const { data = [] } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
}>();
const emits = defineEmits<{
  typeChange: [type: 0 | 1];
}>();

// const campusStore = useCampusStore();
// const { activeCampusId } = storeToRefs(campusStore);
const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
const isOverview = computed(() => campusId.value === CampusId.Overview);

const { t } = useI18n();
const activeType = ref<0 | 1>(0);
const radioOptions = computed(() => {
  return [
    { label: t("assetMgr.device"), value: 0 },
    { label: t("assetMgr.furniture"), value: 1 },
  ];
});
watch(activeType, () => {
  emits("typeChange", activeType.value);
});
</script>

<template>
  <div :class="cn('row-span-7 flex flex-col', $attrs.class ?? '')">
    <UiSubTitle :title="isOverview ? $t('assetMgr.campusAssetsExpireDistribution') : $t('assetMgr.assetsExpireDistribution')">
      <template #extra>
        <SegmentedRadioGroup v-model="activeType" :options="radioOptions" />
      </template>
    </UiSubTitle>

    <div class="mt-2 flex-auto overflow-hidden py-2">
      <UiChartBarWithLine :data="data" :legend="['资产数量', '资产金额']" :unit="['万个', '亿元']" color="purple" />
    </div>
  </div>
</template>

<style scoped>

</style>
