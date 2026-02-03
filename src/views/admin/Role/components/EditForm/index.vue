<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import type { IFetchLoginParams } from "@/api/login.ts";
import { useState } from "@/hooks";

defineOptions({ name: "EditForm" });

const formRef = ref<FormInstance>();
const [formData, setFormData, restFormData] = useState(() => ({
  name: "",
  type: "",
  permissions: [] as string[],
}));

const rules: IFormRules<IFetchLoginParams> = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  type: [{ required: true, message: "请输入类型", trigger: "blur" }],
  permissions: [{ required: true, message: "请选择分配权限", trigger: "blur" }],
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
    <AFormItem label="角色名称" name="name">
      <AInput v-model:value="formData.name" placeholder="请输入角色名称" />
    </AFormItem>
    <AFormItem label="角色类型" name="type">
      <AInput v-model:value="formData.type" placeholder="请输入角色类型" />
    </AFormItem>
    <AFormItem label="角色权限" name="permissions">
      <div ref="treeWrapperRef" class="h-40vh">
        <ATree
          v-model:checked-keys="formData.permissions"
          :tree-data="treeData"
          :height="treeHeight"
          checkable
          :field-names="{ title: 'name', key: 'id' }" />
      </div>
    </AFormItem>
  </AForm>
</template>

<style scoped>

</style>
