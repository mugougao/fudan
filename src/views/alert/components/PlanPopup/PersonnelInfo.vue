<script setup lang="tsx">
defineOptions({ name: "PersonnelInfo", inheritAttrs: false });

function PersonnelInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div class="dot-border flex items-center rounded bg-[#344350]/20 px-2 py-2">
      <span class="text-[14px]">
        {label}
        人数
      </span>
      <span class="ml-auto mr-2 block h-[24px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-3 py-1 text-center leading-none">{value}</span>
      <span class="text-[12px]">人</span>
    </div>
  );
}
</script>

<template>
  <div class="personnel-info">
    <div class="h-[100px] px-2 py-2 text-[14px] space-y-2">
      <div class="flex items-center justify-between">
        <span>总人数</span>
        <span>
          <input type="text" class="mx-2 h-[30px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-2 text-[12px] text-white font-number">
          <span>人</span>
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span>饱和度</span>
        <span>
          <input type="text" class="mx-2 h-[30px] w-[80px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-2 text-[12px] text-white font-number">
          <span>%</span>
        </span>
      </div>
    </div>

    <div class="space-y-2">
      <PersonnelInfoItem v-for="i in 4" :key="i" :label="`${i}F`" value="100" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
