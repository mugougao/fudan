<script setup lang="ts">
defineOptions({ name: "RoamingRoutePoiListPopup", inheritAttrs: false });

const { data } = defineProps<{
  data: { name: string; id: string }[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "change", id: string): void;
  (e: "play"): void;
  (e: "stop"): void;
}>();

const visible = defineModel<boolean>("visible", { default: false });
const activeId = defineModel<string>("modelValue", { default: "" });
const activeName = defineModel<string>("name", { default: "" });

const playing = ref(false);

function changeHandler(id: string, name: string) {
  activeId.value = id;
  activeName.value = name;
  emit("change", id);
}

function closeHandler() {
  activeId.value = "";
  emit("close");
}

function playHandler() {
  playing.value = !playing.value;
  if (playing.value) {
    emit("play");
  }
  else {
    emit("stop");
  }
}
</script>

<template>
  <DragPopup
    v-model:visible="visible" :title="$t('viewFuDan.checkInPoints')"
    :width="300" :top="180" :left="240"
    @close="closeHandler">
    <div class="-mx-3">
      <ul class="max-h-[300px] overflow-y-auto text-[16px] space-y-1">
        <li
          v-for="item in data" :key="item.id"
          class="w-fit cursor-pointer px-3 py-1 leading-none font-text-medium"
          :class="activeId === item.id ? 'text-white bg-gradient-to-r from-transparent via-[#CC1A1A] to-transparent' : 'text-white/80 hover:text-white'"
          @click="changeHandler(item.id, item.name)">
          <span> {{ item.name }} </span>
        </li>
      </ul>
      <button
        type="button" class="mx-auto mt-2 size-[25px] flex-center border border-[#CC1A1A] rounded-full bg-transparent from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-[#CC1A1A]/20 via-70% !bg-gradient-to-b"
        :title="!playing ? '播放' : '暂停'"
        @click="playHandler">
        <i class="text-[14px]" :class="!playing ? 'i-ri-play-fill' : 'i-ri-pause-fill'" />
      </button>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">
</style>
