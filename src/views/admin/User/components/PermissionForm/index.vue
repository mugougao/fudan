<script setup lang="ts">
import type { FormInstance, TreeProps } from "ant-design-vue";
import type { IFetchLoginParams } from "@/api/login.ts";
import to from "await-to-js";
import toArrayTree from "xe-utils/toArrayTree";
import { getPermissions, type IGetPermissionResult } from "@/api/admin/user.ts";
import { useState } from "@/hooks";

defineOptions({ name: "PermissionForm" });

const { userId } = defineProps<{
  userId?: string;
}>();

const formRef = ref<FormInstance>();
const [formData,, restFormData] = useState<{
  permissionIds: { checked: number[]; halfChecked: number[] };
}>(() => ({
  permissionIds: { checked: [], halfChecked: [] },
}));

const rules: IFormRules<IFetchLoginParams> = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
};

const { execute } = useAsyncState(
  async () => {
    if (!userId) return [];
    const [err, res] = await to(getPermissions(userId));
    if (err) return [];
    return (res?.resultData || []).sort((a, b) => a.sort_type - b.sort_type);
  },
  [],
  {
    resetOnExecute: false,
    onSuccess(permissionsList) {
      parsePermissions(permissionsList);
    },
  },
);

const permissionsTree = shallowRef<TreeProps["treeData"]>([]);
function parsePermissions(permissionsList: IGetPermissionResult[]) {
  formData.value.permissionIds = {
    checked: permissionsList.filter(({ isexist }) => !!isexist).map(({ id }) => id),
    halfChecked: [],
  };
  permissionsTree.value = toArrayTree(
    permissionsList.map(({ id, parent, name }) => ({ key: id, parentKey: parent, title: name })),
    { children: "children", key: "key", parentKey: "parentKey" },
  );
}

watch(
  () => userId,
  () => {
    execute();
  },
);

defineExpose({
  reset() {
    restFormData();
    formRef.value?.resetFields();
  },
  async validate() {
    await formRef.value?.validate();
    const { checked, halfChecked } = formData.value.permissionIds;
    return [...checked, ...halfChecked];
  },
});
</script>

<template>
  <AForm
    ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }">
    <AFormItem label="权限列表" name="permissionIds">
      <ATree
        v-model:checked-keys="formData.permissionIds"
        :tree-data="permissionsTree"
        :selectable="false"
        checkable
        check-strictly />
    </AFormItem>
  </AForm>
</template>

<style scoped>

</style>
