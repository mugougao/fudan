<script setup lang="tsx">
defineOptions({ name: "AccidentSiteInfo", inheritAttrs: false });

function AccidentSiteInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div class="dot-border flex items-center px-2 py-2 font-text-medium">
      <span class="text-[14px]">
        {label}
        事故点数
      </span>
      <span class="ml-2 mr-1 block h-[24px] w-[60px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-3 py-1 leading-none">{value}</span>
      <span class="text-[12px]">个</span>

      <button type="button" class="ml-auto border border-white rounded-full bg-white/30 px-1.5 text-[12px] hover:border-[#CC1A1A] hover:bg-[#CC1A1A]/20">详情</button>
    </div>
  );
}
</script>

<template>
  <div class="personnel-info">
    <div class="h-[100px] px-2 py-2 text-[14px] space-y-2">
      <div class="flex items-center">
        <span class="shrink-0">事故点数</span>
        <input type="text" class="ml-auto mr-2 h-[30px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-2 text-[12px] text-white">
        <span>个</span>
      </div>
    </div>

    <div class="space-y-2">
      <AccidentSiteInfoItem v-for="i in 4" :key="i" :label="`${i}F`" value="100" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
