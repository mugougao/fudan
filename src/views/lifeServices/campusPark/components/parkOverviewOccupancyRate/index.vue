<script setup lang="ts">
defineOptions({ name: "ParkOverviewOccupancyRate" });
const legend = [
  { title: ">15年", color: "#FF3F3F" },
  { title: "5-10年", color: "#FF6F6F" },
  { title: "<5年", color: "#FF9D9D" },
];
</script>

<template>
  <div class="legend">
    <div class="flex items-center justify-center">
      <div class="icon mt-10px" />
      <div class="ml-12px mt-8px text-18px text-white">
        图例
      </div>
    </div>
    <ul class="content px-20px py-10px">
      <li
        v-for="({ title, color }) in legend" :key="title"
        class="mb-10px flex items-center text-14px">
        <span class="round mr-4" :style="{ backgroundColor: color } " />
        <span>{{ title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.legend {
  background: linear-gradient(
    90deg,
    rgba(21, 44, 56, 0.7167) 0%,
    rgba(3, 22, 44, 0.6023) 38%,
    rgba(14, 27, 43, 0.64) 99%
  );
  box-sizing: border-box;
  border: 1.5px solid transparent;
  border-image-source: linear-gradient(313deg, #ffb0b0 0%, #ffffff 53%, #ffb6b6 100%);
  border-image-slice: 1;
  backdrop-filter: blur(10px);
  .icon {
    width: 18px;
    height: 18px;
    background: url("@/assets/images/lifeServices/campusPark/legend.png") no-repeat;
    background-size: 100% 100%;
  }
  .content {
    margin-top: 10px;
    border-top: 1px solid #ffffff;
  }
  .round {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}
</style>
