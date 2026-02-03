<script setup lang="ts">
import AccidentSiteInfo from "./AccidentSiteInfo.vue";
import ChannelInfo from "./ChannelInfo.vue";
import ObstacleInfo from "./ObstacleInfo.vue";
import PersonnelInfo from "./PersonnelInfo.vue";

defineOptions({ name: "PlanPopup", inheritAttrs: false });

const visible = defineModel<boolean>("visible", { default: false });

const formData = ref({
  name: "",
  code: "",
  stateTime: undefined,
  duration: "",
});

// PersonnelInfo
// ObstacleInfo
// ChannelInfo
// AccidentSiteInfo
</script>

<template>
  <DragPopup v-model:visible="visible" title="方案生成" width="1050px" left="auto" top="100px">
    <AForm class="flex gap-5" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <AFormItem label="方案编号" class="flex-1">
        <AInput v-model:value="formData.code" />
      </AFormItem>
      <AFormItem label="方案名称" class="flex-1">
        <AInput v-model:value="formData.name" />
      </AFormItem>
      <AFormItem label="开始时间" class="flex-1">
        <ADatePicker v-model:value="formData.stateTime" class="!w-full" />
      </AFormItem>
      <AFormItem label="持续时间" class="flex-1">
        <AInputNumber v-model:value="formData.duration" class="!w-full" />
      </AFormItem>
    </AForm>

    <div class="h-[500px] flex gap-3 children:flex-1">
      <div class="col-bg p-3">
        <UiThirdTitle title="人员信息" />
        <PersonnelInfo />
      </div>
      <div class="col-bg p-3">
        <UiThirdTitle title="障碍物信息" />
        <ObstacleInfo />
      </div>
      <div class="col-bg p-3">
        <UiThirdTitle title="通道信息" />
        <ChannelInfo />
      </div>
      <div class="col-bg p-3">
        <UiThirdTitle title="事故点信息" />
        <AccidentSiteInfo />
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">
.col-bg {
  background:
    linear-gradient(to right, rgba(#fff3f3, 0.4), rgba(#fff3f3, 0.4)) no-repeat left top / 100% 1px,
    linear-gradient(to bottom, rgba(#fff3f3, 0.4), rgba(#fff3f3, 0.08)) no-repeat left top / 1px 100%,
    linear-gradient(to bottom, rgba(#fff3f3, 0.4), rgba(#fff3f3, 0.08)) no-repeat right top / 1px 100%,
    linear-gradient(to right, rgba(#fff3f3, 0.08), rgba(#fff3f3, 0.08)) no-repeat left bottom / 100% 1px,
    linear-gradient(to bottom, rgba(#cc1a1a, 0.3), rgba(#000a17, 0.2));
}
</style>
