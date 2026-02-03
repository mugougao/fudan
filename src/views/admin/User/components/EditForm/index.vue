<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import type { userItem } from "@/api/admin/user.ts";
import type { IFetchLoginParams } from "@/api/login.ts";
import { useState } from "@/hooks";

defineOptions({ name: "EditForm" });

const { data = {} } = defineProps<{
  data: Partial<userItem>;
}>();

const formRef = ref<FormInstance>();
const [formData,, restFormData] = useState(() => ({
  username: "",
  jobNumber: "",
  department: "",
  section: "",
}));

watch(
  () => data,
  (val) => {
    Object.assign(formData.value, val);
  },
  { deep: true, immediate: true },
);

const rules: IFormRules<IFetchLoginParams> = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  jobNumber: [{ required: true, message: "请输入工号", trigger: "blur" }],
  department: [{ required: true, message: "请输入部门", trigger: "blur" }],
  section: [{ required: true, message: "请输入科室", trigger: "blur" }],
};

defineExpose({
  reset() {
    restFormData();
    formRef.value?.resetFields();
  },
  async validate() {
    await formRef.value?.validate();
    return formData.value;
  },
});
</script>

<template>
  <AForm
    ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }">
    <AFormItem label="姓名" name="username">
      <AInput v-model:value="formData.username" placeholder="请输入姓名" />
    </AFormItem>
    <AFormItem label="工号" name="jobNumber">
      <AInput v-model:value="formData.jobNumber" placeholder="请输入工号" />
    </AFormItem>
    <AFormItem label="部门" name="department">
      <AInput v-model:value="formData.department" placeholder="请输入部门" />
    </AFormItem>
    <AFormItem label="科室" name="section">
      <AInput v-model:value="formData.section" placeholder="请输入科室" />
    </AFormItem>
  </AForm>
</template>

<style scoped>

</style>
