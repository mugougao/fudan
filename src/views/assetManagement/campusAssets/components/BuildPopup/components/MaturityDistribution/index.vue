<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineOptions({ name: "MaturityDistribution" });

const { data } = defineProps<{
  data: { name: string; value1: number; value2: number }[];
}>();

const emits = defineEmits<{
  typeChange: [type: 0 | 1];
}>();
const { t } = useI18n();
const activeType = ref<0 | 1>(0);
const radioOptions = computed(() => [
  { label: t("assetMgr.device"), value: 0 },
  { label: t("assetMgr.furniture"), value: 1 },
]);
watch(activeType, () => {
  emits("typeChange", activeType.value);
});
</script>

<template>
  <div class="wh-full flex flex-col">
    <div class="mb-2 flex items-center justify-end gap-2 pr-5 text-14px">
      <SegmentedRadioGroup v-model="activeType" :options="radioOptions" />
    </div>

    <div class="flex-auto overflow-hidden">
      <UiChartBarWithLine :data="data" :legend="['资产数量', '资产金额']" :unit="['个', '万元']" />
    </div>
  </div>
</template>

<style scoped>

</style>
