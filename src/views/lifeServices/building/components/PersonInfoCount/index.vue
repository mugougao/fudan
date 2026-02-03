<script setup lang="ts">
import { get } from "lodash";
import { numberToThousands } from "@/utils";

defineOptions({ name: "PersonInfoCount" });

const { data = {} } = defineProps<{
  data: any;
}>();

const list = [
  { icon: "i-svg-icon-approval", title: "dormitory.build.totalPeople", field: "total", suffix: "人", format: numberToThousands },
  { icon: "i-svg-icon-checkOut", title: "dormitory.build.occupancyRate", field: "occupancyRate", suffix: "%" },
  // { title: "党员比例", field: "proportionOfPartyMembers", suffix: "%" },
];
</script>

<template>
  <div class="person-info-count grid grid-cols-2 mx-2 mt-2 shrink-0 gap-x-3 gap-y-0.5 overflow-hidden">
    <UiCountItemBox
      v-for="({ title, field, icon, suffix }, index) in list" :key="index"
      :icon="icon" :name="$t(title)" :value="get(data, field, 0)" :unit="suffix" />
  </div>
</template>

<style scoped lang="scss">

</style>
