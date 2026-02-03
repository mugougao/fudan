<script setup lang="tsx">
defineOptions({ name: "RepairOverview", inheritAttrs: false });

const { data = [0, 0] } = defineProps<{
  data?: [number, number];
}>();
</script>

<template>
  <div class="repair-overview mx-0.5 h-full flex items-center justify-between gap-1.5 children:h-[70px] children:flex-1">
    <UiCountItemBox icon="i-svg-icon-repair" :name="$t('construction.repair.yearTotalRepair')" :value="data[0]">
      <template #name>
        <span class="text-[12px]">{{ $t('construction.repair.yearTotalRepair') }}</span>
      </template>
    </UiCountItemBox>
    <UiCountItemBox icon="i-svg-icon-repair" :name="$t('construction.repair.ongoingRepair')" :value="data[1]">
      <template #name>
        <span class="text-[12px]">{{ $t('construction.repair.ongoingRepair') }}</span>
      </template>
    </UiCountItemBox>
  </div>
</template>

<style scoped lang="scss">

</style>
