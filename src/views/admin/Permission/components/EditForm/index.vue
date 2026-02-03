<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import type { IFetchLoginParams } from "@/api/login.ts";
import { useState } from "@/hooks";

defineOptions({ name: "EditForm" });

const formRef = ref<FormInstance>();
const [formData, setFormData, restFormData] = useState(() => ({
  name: "",
  type: "0",
  parent: undefined as string | undefined,
  routeUrl: undefined,
}));

const rules: IFormRules<IFetchLoginParams> = {
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择权限类型", trigger: "blur" }],
  // parent: [{ required: true, message: '请选择上级权限', trigger: 'blur' }],
  routeUrl: [{ required: true, message: "请输入权限路径", trigger: "blur" }],
};

const { state: treeData } = useAsyncState(async () => {
  // const [err, res] = await to(list());
  // if (err) return [];
  // return toArrayTree(res?.resultData || [], { key: "id", children: "children", parentKey: "parent" });

  return [];
}, []);
const treeWrapperRef = ref<HTMLElement>();
const { height: treeHeight } = useElementSize(treeWrapperRef);

defineExpose({
  resetForm() {
    restFormData();
    formRef.value?.resetFields();
  },
  submitForm() {
    formRef.value?.validate();
  },
});
</script>

<template>
  <AForm ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
    <AFormItem label="权限名称" name="name">
      <AInput v-model:value="formData.name" placeholder="请输入权限名称" />
    </AFormItem>
    <AFormItem label="权限路径" name="routeUrl">
      <AInput v-model:value="formData.routeUrl" placeholder="请输入权限路径" />
    </AFormItem>
    <AFormItem label="上级权限" name="parent">
      <ATreeSelect
        v-model:value="formData.parent"
        :tree-data="treeData"
        :field-names="{ label: 'name', value: 'id' }"
        placeholder="请选择上级权限"
        allow-clear />
    </AFormItem>
    <AFormItem label="类型" name="type">
      <ARadioGroup
        v-model:value="formData.type"
        :options="[
          { label: '菜单', value: '0' },
          { label: '按钮', value: '1' },
        ]" />
    </AFormItem>
  </AForm>
</template>

<style scoped>

</style>
