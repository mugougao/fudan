<script setup lang="ts">
import type { FormInstance, Rule } from "ant-design-vue/es/form";

defineOptions({ name: "AddCasePopup", inheritAttrs: false });

const emit = defineEmits<{
  nextStep: [formData: any];
}>();

const visible = defineModel<boolean>("visible", { default: false });

const formData = reactive({ name: "", startTime: undefined, duration: 30 });
const formRule: Record<string, Rule | Rule[]> = {
  name: [
    { required: true, message: "请输入方案名称" },
    { max: 20, message: "长度不能超过20个字符" },
  ],
  startTime: [{ required: true, message: "请选择开始时间" }],
  duration: [{ required: true, message: "请选择模拟时长" }],
};
const formRef = useTemplateRef<FormInstance>("formRef");
async function nextStep() {
  await formRef.value?.validate();
  emit("nextStep", formData);
}
</script>

<template>
  <DragPopup v-model:visible="visible" title="新增案例" width="450px" top="150px" left="auto">
    <UiThirdTitle title="创建新仿真模拟方案" />

    <div class="p-2">
      <AForm
        ref="formRef"
        class="[&>.ant-form-item]:mb-3"
        :label-col="{ style: { width: '65px' } }"
        :model="formData" :rules="formRule" hide-required-mark>
        <AFormItem label="方案名称" name="name">
          <AInput v-model:value="formData.name" size="large" placeholder="请输入方案名称" />
        </AFormItem>
        <AFormItem label="开始时间" name="startTime">
          <ADatePicker v-model:value="formData.startTime" size="large" placeholder="请输入方案名称" value-format="YYYY-MM-DD HH:mm:ss" class="w-full" />
        </AFormItem>
        <AFormItem label="模拟时长" name="duration">
          <div class="flex items-center">
            <div class="flex-auto overflow-hidden pl-1">
              <UiSliderSkew v-model="formData.duration" />
            </div>
            <span class="inline-block w-[50px] text-right text-[14px] text-white">{{ formData.duration }}min</span>
          </div>
        </AFormItem>
      </AForm>

      <div class="text-center">
        <button
          type="button"
          class="relative mx-auto mt-3 flex items-center justify-center gap-2 border border-[#CC1A1A] bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% px-8 py-1 text-[14px] !bg-gradient-to-b"
          @click="nextStep">
          <span class="absolute left-[-3px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
          <span class="absolute right-[-2px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
          下一步
        </button>
      </div>
    </div>
  </DragPopup>
</template>

<style scoped lang="scss">

</style>
