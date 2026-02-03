<script setup lang="tsx">
import type { SetupContext } from "vue";
import { InputNumber } from "ant-design-vue";
import { nanoid } from "nanoid";

defineOptions({ name: "SetupObstacle", inheritAttrs: false });

const floor = ref("4");
const floorList = [
  { label: "4F", value: "4" },
  { label: "3F", value: "3" },
  { label: "2F", value: "2" },
  { label: "1F", value: "1" },
];

const obstacleList = ref({
  4: [
    { id: "1", radius: 1.5 },
    { id: "2", radius: 1.5 },
  ],
  3: [
    { id: "1", radius: 1.5 },
    { id: "2", radius: 1.5 },
  ],
  2: [
    { id: "1", radius: 1.5 },
    { id: "2", radius: 1.5 },
  ],
  1: [
    { id: "1", radius: 1.5 },
    { id: "2", radius: 1.5 },
  ],
});

const floorObstacleList = computed({
  get: () => obstacleList.value[floor.value],
  set: (value) => {
    obstacleList.value[floor.value] = value;
  },
});

function addObstacle() {
  floorObstacleList.value = [
    ...floorObstacleList.value,
    { id: nanoid(), radius: 1.5 },
  ];
}

function deleteObstacle(index: number) {
  const arr = [...floorObstacleList.value];
  arr.splice(index, 1);
  floorObstacleList.value = arr;
}

function ObstacleListItem(
  { label, radius }: { label: string;radius: number },
  content: SetupContext<{
    "update:radius": (radius: number) => void;
    "delete": () => void;
    "location": () => void;
  }>,
) {
  function updateRadius(radius: number) {
    let _radius = radius;
    if (radius < 0) {
      _radius = 0;
    }
    content.emit("update:radius", _radius);
  }

  return (
    <div class="dot-border flex items-center p-2">
      <span class="ml-0.5">
        <i class="i-svg-icon-raw-obstacle"></i>
      </span>
      <span class="inline-block w-[80px] text-[16px]">{label}</span>
      <span class="ml-5 mr-auto flex items-center">
        <span class="mr-1 text-[16px]">半径</span>
        <InputNumber class="!w-[60px]" size="small" value={radius} onUpdate:value={(val: any) => updateRadius(val)} />
        <span class="ml-0.5 self-end text-[14px]">m</span>
      </span>

      <button
        type="button"
        class="mr-2 size-[26px] flex items-center justify-center border border-[#CC1A1A] rounded-full bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% !bg-gradient-to-b"
        onClick={() => content.emit("location")}
      >
        <i class="i-ri-map-pin-2-fill text-[12px]"></i>
      </button>
      <button
        type="button"
        class="size-[26px] flex items-center justify-center border border-[#CC1A1A] rounded-full bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% !bg-gradient-to-b"
        onClick={() => content.emit("delete")}
      >
        <i class="i-ri-delete-bin-5-fill text-[12px]"></i>
      </button>

    </div>
  );
}
</script>

<template>
  <BoxPanel title="障碍物模拟" class="row-span-10">
    <ul class="floor-box text-center">
      <li
        v-for="(item) in floorList" :key="item.value"
        class="inline-block w-[50px] cursor-pointer text-center"
        :class="floor === item.value && 'active'"
        @click="floor = item.value">
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <div class="mt-2 h-[200px] overflow-y-auto space-y-1">
      <ObstacleListItem
        v-for="({ id }, index) in floorObstacleList" :key="id"
        v-model:radius="floorObstacleList[index].radius" :label="`障碍物${index + 1}`"
        @delete="deleteObstacle(index)" />
    </div>
    <button
      type="button"
      class="relative mx-auto mt-3 flex items-center justify-center gap-2 border border-[#CC1A1A] bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% px-8 py-1 text-[14px] !bg-gradient-to-b"
      @click="addObstacle">
      <span class="absolute left-[-3px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
      <span class="absolute right-[-2px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
      <i class="i-ri-add-circle-line" />
      新增障碍物
    </button>
  </BoxPanel>
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
