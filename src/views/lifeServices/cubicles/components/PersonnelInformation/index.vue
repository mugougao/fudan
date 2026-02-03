<script setup lang="ts">
const { list = [] } = defineProps<{
  list?: any[];
}>();

// 提取字符串中的数字部分
function extractNumber(str: string) {
  const match = str.match(/\d+/); // 使用正则表达式匹配数字
  return match ? Number.parseInt(match[0], 10) : 0; // 如果找到匹配项，则返回整数形式的数字；否则返回0
}

const newList = computed(() => {
  return (list || [])
    .sort((a, b) => {
      const numA = extractNumber(a.cwmc);
      const numB = extractNumber(b.cwmc);
      return numA - numB;
    });
});
</script>

<template>
  <UiBoxPanel
    title-path="dormitory.room.personnelInformation"
    class="row-span-16 overflow-hidden overflow-y-auto">
    <EmptyWrapper :is-empty="!newList.length">
      <div v-for="(item, index) in newList" :key="index" class="bed-list-item mx-2 mt-2 flex items-center">
        <div class="dot-border size-[80px] p-1.5">
          <div class="h-full w-full flex flex-col items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[#FFE5E5]">
            <i class="i-ri-hotel-bed-fill text-2xl" />
            <span class="text-[14px] font-title">{{ item.cwmc }}</span>
          </div>
        </div>

        <div class="dot-border ml-2 h-[80px] flex flex-auto items-center overflow-hidden p-1.5">
          <div class="user-box relative size-[68px] border border-[#FFF3F3]/20 from-[#000A17]/30 to-[#000A17]/6 bg-gradient-to-b">
            <div class="user-profilePicture h-full w-full flex items-center justify-center text-2xl text-[#FFF3F3]/10">
              <i class="i-ri-user-2-fill" />
            </div>
            <span class="absolute bottom-0 left-1/2 block w-full py-0.5 text-center text-[12px] font-text-medium -translate-x-1/2">{{ item.xm }}</span>
          </div>

          <ul class="ml-2 leading-none font-text-medium space-y-1">
            <li>
              <span class="mr-1 text-[12px] text-white/60">{{ $tm('dormitory.room.personnelInformationField')[0] }}:</span>
              <span class="text-[12px] text-white">{{ item.xq }}</span>
            </li>
            <li>
              <span class="mr-1 text-[12px] text-white/60">{{ $tm('dormitory.room.personnelInformationField')[1] }}:</span>
              <span class="text-[12px] text-white">{{ item.xl }}</span>
            </li>
            <li>
              <span class="mr-1 text-[12px] text-white/60">{{ $tm('dormitory.room.personnelInformationField')[2] }}:</span>
              <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-number">{{ item.yjbysj }}</span>
            </li>
          </ul>
        </div>
      </div>
    </EmptyWrapper>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.bed-list-item {
  & > div {
    .user-box {
      span {
        background:
          linear-gradient(90deg, rgba(#fff3f3, 0) 0%, rgba(#fff3f3, 0.2) 50%, rgba(#fff3f3, 0) 100%) no-repeat left
            top / 100% 1px,
          linear-gradient(90deg, rgba(#fff3f3, 0) 0%, rgba(#fff3f3, 0.2) 50%, rgba(#fff3f3, 0) 100%) no-repeat left
            bottom / 100% 1px,
          linear-gradient(90deg, rgba(#cc1a1a, 0) 0%, rgba(#cc1a1a, 0.2) 50%, rgba(#cc1a1a, 0) 100%);
      }
    }
  }
}
</style>
