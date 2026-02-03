<script setup lang="ts">
defineOptions({ name: "SimulationSettingsFloorSelect", inheritAttrs: false });

const floor = defineModel<string>("floor", { default: "1" });
const floorList = [
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
];
</script>

<template>
  <div class="simulation-settings-floor-select inline-block w-[185px] rounded-lg bg-[#454545]/55 py-8 pl-5 pr-8 backdrop-blur-sm">
    <label
      v-for="{ label, value } in floorList" :key="value"
      class="simulation-settings-floor-select-item relative flex flex cursor-pointer items-center items-center justify-between">
      <span class="simulation-settings-floor-select-item-label text-[18px] font-text-bold">{{ label }}F</span>
      <span class="simulation-settings-floor-select-item-radio">
        <input v-model="floor" type="radio" name="SimulationSettingsFloorSelect" :value="value" class="hidden">
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.simulation-settings-floor-select {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 2px #fff solid;
    border-radius: 8px;
    mask: linear-gradient(45deg, #000 0%, transparent 50%, #000 100%);
    pointer-events: none;
  }
  .simulation-settings-floor-select-item {
    .simulation-settings-floor-select-item-label {
      color: #c2c2c2;
      display: inline-flex;
      width: 32px;
      height: 32px;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      transition: all 0.2s ease-in-out;
    }

    &:has(input:checked) {
      z-index: 9999;
      .simulation-settings-floor-select-item-label {
        background-color: #ffffff;
        border-radius: 999px;
        color: #c92525;
        margin-left: 0px;
      }
      &::before {
        content: "";
        position: absolute;
        top: calc(50% - 1px);
        left: 30px;
        width: calc(100% - 30px);
        height: 2px;
        background-color: #fff;
        z-index: -1;
      }
    }

    .simulation-settings-floor-select-item-radio {
      display: inline-block;
      width: 35px;
      height: 35px;
      position: relative;
      transform: scaleY(0.8) scaleX(1);
      transition: all 0.2s ease-in-out;

      &::before,
      &::after {
        content: "";
        position: absolute;
        border-radius: 6px;
        transform: rotate(45deg);
      }
    }

    .simulation-settings-floor-select-item-radio:not(input:checked) {
      &::before {
        inset: 0;
        width: 100%;
        height: 100%;
        background-color: #909090;
        box-shadow: 0px 2px 4px 0px rgba(#000, 0.3);
      }
      &::after {
        display: none;
      }
    }

    .simulation-settings-floor-select-item-radio:has(input:checked) {
      display: inline-block;
      width: 35px;
      height: 35px;
      position: relative;
      transform: scaleX(1.2) scaleY(0.95);

      &::before,
      &::after {
        content: "";
        position: absolute;
        border-radius: 6px;
        transform: rotate(45deg);
      }
      &::before {
        inset: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
      }
      &::after {
        display: inline;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        top: 5px;
        left: 5px;
        border: 2px #c92525 solid;
      }
    }
  }
}
</style>
