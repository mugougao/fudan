<script setup lang="ts">
import dayjs from "dayjs";
import { cn, numberToThousands } from "@/utils";

defineOptions({ name: "CampusGatepost", inheritAttrs: false });

const { count, traffic } = defineProps<{
  count: number;
  traffic: { name: string; value: number }[];
}>();

const data = computed(() => {
  const hour = dayjs().hour();
  const arr = traffic.filter(({ name }, index, arr) => Number(name) <= hour);
  return arr.slice(0, -1);
});
</script>

<template>
  <div :class="cn('campus-gatepost flex flex-col w-full', $attrs.class ?? '')">
    <UiSubTitle title-path="overviw.campusGate" class="shrink-0" />
    <UiCountItemStrip icon="i-svg-icon-users2" :name="$t('overviw.campusGate')" :value="numberToThousands(count)" unit="次" class="shrink-0" />
    <div class="relative flex-auto overflow-hidden">
      <UiChartLine :data="data" unit="人" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
