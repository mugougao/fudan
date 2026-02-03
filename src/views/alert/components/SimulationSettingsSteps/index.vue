<script setup lang="ts">
defineOptions({ name: "SimulationSettingsSteps", inheritAttrs: false });

const steps = [
  { label: "场景设定", key: "scene" },
  { label: "障碍物设置", key: "obstacle" },
  { label: "通道状态设置", key: "channelStatus" },
  { label: "事故点设置", key: "accidentPoint" },
  { label: "方案生成", key: "plan" },
] as const;

export type IStepKeys = typeof steps[number]["key"];

const current = defineModel<IStepKeys>("step", { default: "scene" });
const currentIndex = computed(() => steps.findIndex(({ key }) => key === current.value));
</script>

<template>
  <div class="simulation-settings-steps relative py-10 space-y-8">
    <label
      v-for="({ label, key }, index) in steps" :key="key"
      class="simulation-settings-steps-item relative flex cursor-pointer items-center"
      :class="index <= currentIndex && 'completed'">
      <input v-model="current" type="radio" :value="key" class="simulation-settings-steps-item-radio absolute hidden">
      <span class="block size-[10px] border-2 border-white rounded-full bg-[#CC1A1A]" />
      <span class="ml-3 mr-2">
        <img src="@/assets/images_new/arrow-2.png" alt="arrow">
      </span>
      <span class="simulation-settings-steps-item-label flex items-center pl-3 text-[16px] font-title">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.simulation-settings-steps {
  padding-left: 5px;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 100%;
    color: transparent;
    background: radial-gradient(#fff 0%, #fff 2px, transparent 2px);
    background-size: 20px 20px;
    background-color: rgba(#cc1a1a, 0.4);
    mask: linear-gradient(to bottom, transparent -20%, #000 50%, transparent 120%);
    z-index: 1;
  }

  .simulation-settings-steps-item {
    z-index: 2;
    .simulation-settings-steps-item-label {
      min-width: 121px;
      height: 36px;
      background-image: url("@/assets/images_new/btn-bg.png");
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 121px 36px;
    }

    &:has(input:checked),
    &.completed {
      span.simulation-settings-steps-item-label {
        background-image: url("@/assets/images_new/btn-bg-active.png");
      }
    }
  }
}
</style>
