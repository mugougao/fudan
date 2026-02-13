<script setup lang="tsx">
import type { IDescriptionsProps } from "@/components/Descriptions/index.vue";
import { camelizeProps, cn } from "@/utils";

defineOptions({ name: "DeviceInfo", inheritAttrs: false });

const { desc = "", images, data = {} } = defineProps<{
  desc?: string;
  images?: string[];
  data?: any;
}>();

const columns: IDescriptionsProps["columns"] = [
  { label: "负责人", field: "header" },
  { label: "联系方式", field: "phone" },
  { label: "存放地点", field: "storageLocation", className: "col-span-full" },
  { label: "加速电压", field: "accelerationVoltage" },
  { label: "总束流", field: "totalBeam" },
  { label: "单电子束束流", field: "singleElectronBeamBeam" },
  { label: "电子束数量", field: "numberOfElectronBeams" },
  { label: "驻留时间", field: "residenceTime" },
  { label: "像素尺寸", field: "pixelSize" },
  { label: "电子枪类型", field: "electronGunType", className: "col-span-full" },
];

const index = ref(0);
function onAfterChange(current: number) {
  index.value = current;
}

function ListRender(props: { listStr: string }) {
  const { listStr } = camelizeProps(props);
  return (
    <ul class="text-[14px] space-y-1">
      {
        // \n\n 或者 \r\n\r\n 分割
        (listStr || "").split(/\n\n|\r\n\r\n/).map((item) => {
          return (
            <li class="list-item flex">
              {item}
            </li>
          );
        })
      }
    </ul>
  );
}
</script>

<template>
  <div :class="cn('device-info space-y-5', $attrs.class ?? '')">
    <UiSubTitle title="电镜设备介绍" />
    <div class="text-[14px] text-white/80">
      <p>{{ desc }}</p>
    </div>

    <div v-if="images?.length" class="relative h-[200px] w-full">
      <div class="img-box mx-auto p-2">
        <ACarousel
          autoplay draggable dots-class="custom-paging [&>li]:!size-[8px] !bottom-[-15px]"
          :after-change="onAfterChange">
          <div
            v-for="(src) in images" :key="src"
            class="relative aspect-video bg-gray-300">
            <img :src="src" alt="img" class="h-full w-full object-cover">
          </div>
          <template #customPaging="{ i }">
            <span
              class="relative block h-full w-full cursor-pointer"
              :class="index === i && 'border border-r-white/50 rounded-full border-white -rotate-45' ">
              <span
                class="absolute left-1/2 top-1/2 block rounded-full -translate-1/2"
                :class="index === i ? 'size-[3px] bg-white' : 'size-[6px] bg-[#868686]'" />
            </span>
          </template>
        </ACarousel>
      </div>
    </div>

    <div class="">
      <ListRender :list-str="data?.xncs || ''" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-box {
  background: url("@/assets/images_new/popup-bg.png") no-repeat center center;
  background-size: contain;
}
</style>
