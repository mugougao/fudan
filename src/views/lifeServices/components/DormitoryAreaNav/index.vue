<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getDormitoryArea } from "@/api/lifeServices";
import { cn } from "@/utils";

defineOptions({ name: "DormitoryAreaNav" });

const router = useRouter();

// 校区 ID
const campusId = useRouteQuery("campusId") as unknown as Ref<string>;
// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;
const { state: dormitoryAreaList, execute } = useAsyncState(async () => {
  const [err, res] = await to(getDormitoryArea(campusId.value));
  if (err) return [];
  return (res?.resultData?.features || []).map((item: any) => ({ label: item.properties.mc, value: item.properties.id }));
}, [], { immediate: false, resetOnExecute: false });

watch(campusId, () => execute(), { immediate: true });

const dormitoryAreaName = computed(() => {
  const dormitoryArea = dormitoryAreaList.value.find((item: any) => item.value === dormitoryAreaId.value);
  return dormitoryArea?.label || "";
});

watch(dormitoryAreaId, async () => {
  await nextTick();
  await router.push({ path: "/lifeServices/campusPark", query: { campusId: campusId.value, dormitoryAreaId: dormitoryAreaId.value, dormitoryAreaName: dormitoryAreaName.value } });
});
</script>

<template>
  <!-- <TabNav v-model="dormitoryAreaId" :options="dormitoryAreaList" class="ml-430px mt-1" /> -->
  <ul class="dormitory-area-nav absolute left-1/2 top-0 flex gap-3 -translate-x-1/2">
    <li
      v-for="({ label, value }) in dormitoryAreaList" :key="value"
      :class="cn(
        'px-3 relative cursor-pointer whitespace-nowrap',
        'border border-white/60',
        'bg-gradient-to-b bg-[#000A17]/60 from-white/10 via-white/30 to-transparent',
        'text-[16px] text-white/60 font-text-medium',
        dormitoryAreaId === value && 'text-white border-[#CC1A1A] from-[#DC2F2F]/25 via-[#DC2F2F]/75 via-90% bg-[#000A17]/40',
      )"
      @click="dormitoryAreaId = value">
      <span :class="cn('absolute left-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', dormitoryAreaId === value && 'bg-[#EABC8B]')" />
      <span :class="cn('absolute right-[-2px] top-1/2 mt-[-2px] inline-block size-[4px] bg-white', dormitoryAreaId === value && 'bg-[#EABC8B]')" />
      <span>{{ label }}</span>
    </li>
  </ul>
</template>

<style scoped>

</style>
