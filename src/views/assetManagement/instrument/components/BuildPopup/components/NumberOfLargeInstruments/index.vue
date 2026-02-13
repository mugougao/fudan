<script setup lang="ts">
import get from "lodash/get";

defineOptions({ name: "NumberOfLargeInstruments" });

const { data = {} } = defineProps<{
  data?: Record<string, any>;
}>();

const emits = defineEmits<{
  (e: "details"): void;
}>();

const columns = [
  { title: "总设备数", field: "sl", suffix: "台" },
  // { title: "上一年度机时达标", field: "zd", suffix: "台" },
  { title: "总金额数", field: "je", suffix: "万元" },
  { title: "终端安装总数", field: "zdazzs", suffix: "台" },
];
</script>

<template>
  <ul class="grid grid-cols-2 mx-1 my-2 columns-2">
    <li
      v-for="({ title, field, suffix }) in columns" :key="field"
      class="flex items-center whitespace-nowrap text-14px text-white font-text-medium">
      <template v-if="field === 'zdazzs'">
        <div
          class="flex cursor-pointer underline decoration-2 hover:decoration-#FFA372"
          @click="emits('details')">
          <div class="mr-1">
            <GradientText :deg="180" :colors="{ 0: '#FFA372', 100: '#fff' }">
              {{ title }}:
            </GradientText>
          </div>
          <div>
            <GradientText :deg="180" :colors="{ 0: '#FFA372', 100: '#fff' }">
              <span class="font-number">{{ get(data, field, 0) }}</span>
              <span>{{ suffix }}</span>
            </GradientText>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="mr-1 text-[14px] text-white/80 font-text">
          {{ title }}:
        </div>
        <div>
          <span class="text-[18px] font-number">{{ get(data, field, 0) }}</span>
          <span class="text-[12px] text-white/80">{{ suffix }}</span>
        </div>
      </template>
    </li>
  </ul>
</template>

<style scoped>

</style>
