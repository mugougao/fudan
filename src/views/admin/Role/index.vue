<script setup lang="ts">
import { useState } from "@/hooks";
import EditForm from "./components/EditForm/index.vue";

const formData = reactive({
  username: "",
});
const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(() => []);

const columns: any[] = [
  { title: "序号", dataIndex: "index", width: 80, align: "center", customRender: ({ index }) => index + 1 },
  { title: "角色名称", dataIndex: "name" },
  { title: "角色类型", dataIndex: "type" },
  { title: "操作", dataIndex: "action", width: 200 },
];

const dataSource = Array.from({ length: 100 }, (_, i) => ({
  index: i,
  name: `角色名称${i + 1}`,
  type: `角色类型${i + 1}`,
}));

const [visible, setVisible] = useState(false);
</script>

<template>
  <div class="rounded-lg bg-white p-5 shadow-lg space-y-5">
    <AForm layout="inline">
      <AFormItem name="username">
        <AInput v-model:value="formData.username" placeholder="请输入角色名称" allow-clear />
      </AFormItem>
      <AFormItem>
        <AButton type="primary">
          查询
        </AButton>
      </AFormItem>
      <AFormItem>
        <ASpace>
          <AButton type="primary" @click="setVisible(true)">
            新增
          </AButton>
          <AButton type="primary" danger>
            删除
          </AButton>
        </ASpace>
      </AFormItem>
    </AForm>

    <ATable
      :row-selection="{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys as any[]) }"
      :columns="columns" :data-source="dataSource">
      <template #bodyCell="{ column: { dataIndex } }">
        <template v-if="dataIndex === 'action'">
          <ASpace>
            <AButton type="primary" size="small" @click="setVisible(true)">
              编辑
            </AButton>
            <AButton type="primary" danger size="small">
              删除
            </AButton>
          </ASpace>
        </template>
      </template>
    </ATable>
  </div>

  <AModal v-model:visible="visible" title="提示">
    <EditForm />
  </AModal>
</template>

<style scoped lang="scss">

</style>
