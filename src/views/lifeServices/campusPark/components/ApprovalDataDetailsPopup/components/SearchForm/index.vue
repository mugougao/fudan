<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import dayjs from "dayjs";
import { getApprovalDetailBuildingList } from "@/api/lifeServices";

defineOptions({ name: "SearchForm", inheritAttrs: false });

const emit = defineEmits<{
  submit: [data: IFormData];
}>();

// 宿舍区 ID
const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

interface IFormData {
  startTime: string;
  endTime: string;
  buildId?: string;
}

const formInstance = useTemplateRef<FormInstance>("formInstance");
const formData = ref<IFormData>({
  startTime: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  endTime: dayjs().format("YYYY-MM-DD"),
  buildId: undefined,
});

const formRules: IFormRules<IFormData> = {
  startTime: [
    {
      validator: (rule, value) => {
        if (!value)
        // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("请选择开始时间");
        if (dayjs(value).isAfter(formData.value.endTime))
        // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("开始时间不能大于结束时间");
        return Promise.resolve();
      },
    },
  ],
  endTime: [{
    validator: (rule, value) => {
      if (!value)
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject("请选择结束时间");
      if (dayjs(value).isBefore(formData.value.startTime))
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject("结束时间不能小于开始时间");
      return Promise.resolve();
    },

  }],
};

const { state: buildOptions, execute: getBuildOptions } = useAsyncState(
  async () => {
    const [err, res] = await to(getApprovalDetailBuildingList(dormitoryAreaId.value));
    return err ? [] : (res?.resultData || []).map(item => ({ label: item.lymc, value: item.id }));
  },
  [],
  { immediate: true },
);

async function handleChange() {
  const value = await formInstance.value!.validate();
  emit("submit", value as IFormData);
}

onMounted(() => {
  emit("submit", formData.value);
});

watch(
  dormitoryAreaId,
  () => {
    getBuildOptions();
    formData.value.buildId = undefined;
    handleChange();
  },
);
</script>

<template>
  <AForm
    ref="formInstance" :rules="formRules" :model="formData"
    class="search-form flex justify-center gap-8 children:!mb-0">
    <AFormItem name="startTime">
      <ADatePicker v-model:value="formData.startTime" class="!w-[180px]" placeholder="选择开始时间 年/月/日" value-format="YYYY-MM-DD" @change="handleChange" />
    </AFormItem>
    <AFormItem name="endTime">
      <ADatePicker v-model:value="formData.endTime" class="!w-[180px]" placeholder="选择结束时间 年/月/日" value-format="YYYY-MM-DD" @change="handleChange" />
    </AFormItem>
    <AFormItem name="buildId">
      <ASelect
        v-model:value="formData.buildId"
        class="!w-[180px]" :options="buildOptions" placeholder="选择楼栋" allow-clear
        show-search :filter-option="(input: string, option: any) => option.label.includes(input) " @change="handleChange" />
    </AFormItem>
  </AForm>
</template>

<style scoped lang="scss">
.search-form {
  .ant-form-item:first-child {
    @apply relative;
    &:after {
      content: "";
      @apply absolute top-[16px] left-[calc(100%+12px)] w-[10px] h-[1px] bg-[#E5E5E5];
    }
  }
}
</style>
