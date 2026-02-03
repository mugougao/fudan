<script setup lang="ts">
import { Modal } from "ant-design-vue";
import to from "await-to-js";
import { add, del, list, update, updateUserPermissions, type userItem } from "@/api/admin/user.ts";
import { useState } from "@/hooks";
import { useUserStore } from "@/stores/user";
import EditForm from "./components/EditForm/index.vue";
import PermissionForm from "./components/PermissionForm/index.vue";

const router = useRouter();
const userStrore = useUserStore();

const formData = reactive({
  username: "",
});
const [pageParams, setPageParams, resetPageParams] = useState(() => ({ pageNum: 1, pageSize: 10 }));
const [total, setTotal] = useState(0);
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    width: 80,
    align: "center",
    customRender: ({ index }) => {
      const { pageSize, pageNum } = pageParams.value;
      return pageSize * (pageNum - 1) + index + 1;
    },
  },
  { title: "姓名", dataIndex: "username" },
  { title: "工号", dataIndex: "jobNumber" },
  { title: "部门", dataIndex: "department" },
  { title: "科室", dataIndex: "section" },
  { title: "操作", dataIndex: "action", width: 300 },
];

const { state, execute, isLoading } = useAsyncState(async () => {
  const { pageNum, pageSize } = pageParams.value;
  const [err, res] = await to(list(formData.username, pageNum, pageSize));
  if (err) return [];
  const { total = 0, list: _list = [] } = res?.resultData || {};
  setTotal(total);
  return _list || [];
}, [], { resetOnExecute: false });

function handleSearch() {
  resetPageParams();
  execute();
}

const tableProps = computed(() => ({
  loading: isLoading.value,
  dataSource: state.value,
  columns,
  pagination: {
    current: pageParams.value.pageNum,
    pageSize: pageParams.value.pageSize,
    total: total.value,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    onChange(pageNum, pageSize) {
      setPageParams({ pageNum, pageSize });
      execute();
    },
  },
} as any));

async function handleDelete(id) {
  await window.$confirm({ title: "删除操作", content: "确定删除该用户吗？" });
  await del(id);
  await execute();
}

const [visible, setVisible] = useState(false);
const editState = ref<Partial<userItem>>({});
const editStatus = ref<"add" | "edit">("add");
const title = computed(() => editStatus.value === "add" ? "新增用户" : "编辑用户");
const editFormRef = useTemplateRef<InstanceType<typeof EditForm>>("editFormRef");

function handleAdd() {
  editStatus.value = "add";
  editState.value = {};
  setVisible(true);
}

function handleEdit(record: any) {
  editStatus.value = "edit";
  editState.value = record;
  setVisible(true);
}

async function handleOk() {
  const value = await editFormRef.value?.validate();
  const [err] = await to(
    editStatus.value === "add"
      ? add(value as userItem)
      : update(value as userItem),
  );
  if (err) {
    window.$message.error(`${title.value}失败`);
    return;
  }
  window.$message.success(`${title.value}成功`);
  setVisible(false);
  execute();
}

function handleCancel() {
  editFormRef.value?.reset();
  editState.value = {};
}

const [permissionVisible, setPermissionVisible] = useState(false);
const permissionUserId = ref("");

function handleAssignPermissions(record: any) {
  permissionUserId.value = record.id;
  setPermissionVisible(true);
}

const permissionFormRef = useTemplateRef<InstanceType<typeof PermissionForm>>("permissionFormRef");

async function handlePermissionOk() {
  const permissionIds = await permissionFormRef.value?.validate();
  const [err] = await to(updateUserPermissions(permissionUserId.value, permissionIds || []));
  if (err) {
    window.$message.error("分配权限失败");
    return;
  }
  setPermissionVisible(false);
  if (permissionUserId.value === userStrore.userInfo.id) {
    let second = 5;
    const model = Modal.warning({
      title: "提示",
      content: `分配权限成功，${second}秒后重新登录`,
      footer: null,
    });

    function countdown() {
      second = second - 1;
      model.update({
        content: `分配权限成功，${second}秒后重新登录`,
      });
      if (second <= 0) {
        model.destroy();
        userStrore.restUserStore();
        router.push("/login");
      }
      else {
        setTimeout(countdown, 1000);
      }
    }
    setTimeout(countdown, 1000);
  }
  else {
    window.$message.success("分配权限成功");
  }
}

function handlePermissionCancel() {
  permissionFormRef.value?.reset();
  permissionUserId.value = "";
}
</script>

<template>
  <div class="rounded-lg bg-white p-5 shadow-lg space-y-5">
    <AForm layout="inline">
      <AFormItem name="username">
        <AInput v-model:value="formData.username" placeholder="请输入用户名" allow-clear @press-enter="handleSearch" />
      </AFormItem>
      <AFormItem>
        <ASpace>
          <AButton type="primary" @click="handleSearch">
            查询
          </AButton>
          <AButton type="primary" @click="handleAdd">
            新增
          </AButton>
        </ASpace>
      </AFormItem>
    </AForm>

    <ATable v-bind="tableProps">
      <template #bodyCell="{ column: { dataIndex }, record }">
        <template v-if="dataIndex === 'action'">
          <ASpace>
            <AButton type="primary" size="small" @click="handleEdit(record)">
              编辑
            </AButton>
            <AButton type="primary" size="small" @click="handleAssignPermissions(record)">
              分配权限
            </AButton>
            <AButton type="primary" danger size="small" @click="handleDelete(record.id)">
              删除
            </AButton>
          </ASpace>
        </template>
      </template>
    </ATable>
  </div>

  <AModal v-model:open="visible" :title="title" @ok="handleOk" @cancel="handleCancel">
    <EditForm ref="editFormRef" :data="editState" />
  </AModal>

  <AModal
    v-model:open="permissionVisible" title="分配权限" @ok="handlePermissionOk"
    @cancel="handlePermissionCancel">
    <PermissionForm ref="permissionFormRef" :user-id="permissionUserId" />
  </AModal>
</template>
