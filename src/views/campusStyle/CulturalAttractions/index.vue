<script setup lang="ts">
// import landscape from "@/assets/images/campusStyle/landscape.png";

const props = withDefaults(
  defineProps<{
    introduce?: string;
    fristWord?:string;
  }>(),
  {},
);
const introduce = computed(() => {
  if (!props.introduce) return "";
  if (!props.fristWord) return props.introduce;
  return props.introduce?.replace(props.fristWord, "");
});

const hasFristWord = computed(() => props.fristWord && props.introduce?.includes(props.fristWord));


</script>

<template>
  <UiBoxPanel class="row-span-8 flex-col" title="校园文化景点" content-class-name="py-3">
    <div class="text mx-2 h-full overflow-x-hidden overflow-y-auto text-[14px] leading-[24px]">
      <p v-if="hasFristWord" class="float-left text-[18px] font-title bg-gradient-to-b from-red to-white leading-[24px] text-transparent bg-clip-text">{{ fristWord }}</p>
      <p>{{ introduce }}</p>
    </div>
  </UiBoxPanel>
</template>

<style scoped>

</style>
