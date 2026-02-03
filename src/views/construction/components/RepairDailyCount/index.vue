<script setup lang="tsx">
defineOptions({ name: "RepairDailyCount", inheritAttrs: false });

const { data = [0, 0] } = defineProps<{
  data?: [number, number];
}>();

function DailyRepairCountItem({ title, value, color }: { title: string;value: string | number;color: [string, string] }) {
  const [fromColor, endColor] = color;
  return (
    <div class="daily-repair-count flex flex-col items-center">
      <span class="text-[18px] text-[#B1C0CB]">{title}</span>
      <span
        class="bg-clip-text text-[36px] text-transparent font-title"
        style={{ backgroundImage: `linear-gradient(125deg, ${fromColor}, ${endColor})` }}
      >
        {value}
      </span>
    </div>
  );
}
</script>

<template>
  <div class="daily-repair-count flex items-center justify-evenly" :class="$attrs.class ?? ''">
    <UiCountItem icon="i-svg-icon-repair" :name="$t('construction.repair.totalRepair')" :value="data[0]" />
    <UiCountItem icon="i-svg-icon-repair" :name="$t('construction.repair.ongoingRepair')" :value="data[1]" type="yellow" />
  </div>
</template>

<style scoped lang="scss">

</style>
