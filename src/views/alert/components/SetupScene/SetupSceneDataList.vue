<script setup lang="ts">
import { useState } from "@/hooks";
import { cn } from "@/utils";

defineOptions({ name: "SetupSceneDataList", inheritAttrs: false });

const floor = ref("4");
const floorList = [
  { label: "4F", value: "4" },
  { label: "3F", value: "3" },
  { label: "2F", value: "2" },
  { label: "1F", value: "1" },
];

const roomList = computed(() => Array.from(
  { length: 50 },
  (_, i) => {
    return {
      label: `${floor.value}${(i + 1).toString().padStart(2, "0")}`,
      // status: ["setting", "default"],
    };
  },
));

const [activeRoomId, setActiveRoomId] = useState("");
const [visible, setVisible] = useState(false);
const roomData = ref({
  staffSaturation: 40, // 人员饱和度
  maleStudentsRatio: 50, // 男学生占比
  maleTeachersRatio: 50, // 男教师占比
});
function handleRoomClick(id: string) {
  setVisible(true);
  setActiveRoomId(id);
}
</script>

<template>
  <div class="h-full">
    <ul class="floor-box text-center">
      <li
        v-for="(item) in floorList" :key="item.value"
        class="inline-block w-[50px] cursor-pointer text-center"
        :class="floor === item.value && 'active'"
        @click="floor = item.value">
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <div class="grid grid-cols-5 mt-2 h-[250px] gap-2 overflow-y-auto px-3">
      <div
        v-for="{ label } in roomList" :key="label"
        :class="cn(
          'border rounded-sm text-center text-[16px] leading-none py-1 cursor-pointer font-number',
          activeRoomId === label
            ? 'border-[#CC1A1A] bg-gradient-to-b from-[#CC1A1A]/20 via-[#CC1A1A]/75  to-transparent'
            : 'border-[#9E9E9E] text-white',
        )"
        @click="handleRoomClick(label)">
        {{ label }}
      </div>
    </div>

    <DragPopup v-model:visible="visible" title="教室详情" width="450px" top="500px" left="calc(100% - 950px)">
      <UiThirdTitle title="仿真信息" class="mb-2" />
      <AForm class="grid grid-cols-6 children:!mb-1" :label-col="{ style: { width: '80px' } }" label-align="right">
        <AFormItem label="教师名称" class="col-span-2">
          <span class="text-white">{{ activeRoomId }}</span>
        </AFormItem>
        <AFormItem label="饱和度" class="col-span-4">
          <input v-model="roomData.staffSaturation" type="number" class="w-[40px] border border-[#FFE5E5]/20 rounded bg-[#000A17]/30 px-2 py-1 text-center text-white font-number">
          <span class="text-14px text-white">%</span>
        </AFormItem>
        <AFormItem label="学生" class="col-span-full" :label-col="{ style: { width: '70px' } }">
          <div>
            <span class="flex items-center justify-between px-2 font-text-medium">
              <span class="text-white/80">男学生<span class="text-[18px] font-number">{{ roomData.maleStudentsRatio }}</span>%</span>
              <span class="text-white/80">女学生<span class="text-[18px] font-number">{{ 100 - roomData.maleStudentsRatio }}</span>%</span>
            </span>
            <UiSlider v-model="roomData.maleStudentsRatio" :min="0" :max="100" />
          </div>
        </AFormItem>
        <AFormItem label="教师" class="col-span-full" :label-col="{ style: { width: '70px' } }">
          <div>
            <span class="flex items-center justify-between px-2 font-text-medium">
              <span class="text-white/80">男学生<span class="text-[18px] font-number">{{ roomData.maleTeachersRatio }}</span>%</span>
              <span class="text-white/80">女学生<span class="text-[18px] font-number">{{ 100 - roomData.maleTeachersRatio }}</span>%</span>
            </span>
            <UiSlider v-model="roomData.maleTeachersRatio" :min="0" :max="100" />
          </div>
        </AFormItem>
      </AForm>
    </DragPopup>
  </div>
</template>

<style scoped lang="scss">
.floor-box {
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  background: url("@/assets/images_new/floor-bg-mini.png") no-repeat center / 310px 36px;
  li {
    color: rgba(#ffffff, 0.6);
    font-size: 16px;
    &.active {
      color: #ffffff;
      position: relative;
      &:before,
      &::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
      }
      &:before {
        width: 30px;
        height: 5px;
        background-color: red;
        filter: blur(5px);
      }
      &::after {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 4px 4px 4px;
        border-color: transparent transparent#fff transparent;
      }
    }
  }
}
</style>
