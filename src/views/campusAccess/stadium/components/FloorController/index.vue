<script setup lang="ts">
import gymnasiumSplitBuild from "@/utils/WdpMap/campusAccess/stadium/GymnasiumSplitBuild.ts";

defineOptions({ name: "FloorController" });

const floorList = [
  { label: "-1F", value: -1 },
  { label: "1F", value: 1 },
  { label: "2F", value: 2 },
  { label: "3F", value: 3 },
];

const activeFloor = ref<number | undefined>(undefined);

async function handleChange(e) {
  const target = e.target as HTMLInputElement;
  activeFloor.value = target.checked ? Number(target.value) : undefined;
  activeFloor.value
    ? gymnasiumSplitBuild.splitFloor(activeFloor.value?.toString())
    : gymnasiumSplitBuild.close();
}

onBeforeUnmount(() => {
  gymnasiumSplitBuild.close();
});
</script>

<template>
  <section class="floor-controller absolute bottom-20px left-1/2 inline-flex px-5 py-1.5 text-[12px] -translate-x-1/2">
    <span class="mr-5 font-title">{{ $t("venueFacilities.floorControl") }}:</span>
    <ul class="floor-list flex items-center gap-4">
      <li v-for="({ label, value }) in floorList" :key="value">
        <label class="flex cursor-pointer select-none items-center gap-1 text-white/60 leading-none has-[input[type=checkbox]:checked]:text-white">
          <span class="relative size-[12px] inline-flex items-center justify-center border border-[#7B7B7B] bg-[#FFFFFF]/6 has-[input[type=checkbox]:checked]:border-[#CC1A1A] has-[input[type=checkbox]:checked]:bg-[#CC1A1A]/25">
            <input
              :checked="activeFloor === value" type="checkbox" name="floor" :value="value" class="peer hidden"
              @change="handleChange">
            <span class="inline-block size-[6px] bg-[#7B7B7B] peer-checked:bg-[#CC1A1A]" />
          </span>
          <span>{{ label }}</span>
        </label>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.floor-controller {
  background:
    linear-gradient(to right, transparent, #fff, transparent) no-repeat left top / 100% 1px,
    linear-gradient(to right, transparent, #fff, transparent) no-repeat left bottom / 100% 1px,
    linear-gradient(to right, rgba(#000a17, 0.6), rgba(#000a17, 0.6));
  backdrop-filter: blur(6px);
}
</style>
