<script setup lang="tsx">
import type { SetupContext } from "vue";
import { useState } from "@/hooks";
import { camelizeProps } from "@/utils";

defineOptions({ name: "ListlationCaseList", inheritAttrs: false });

const emit = defineEmits<{
  add: [];
}>();

function ListlationCaseList(
  props: { label: string;isEdit: boolean;playing: boolean },
  context: SetupContext<{
    delete: () => Promise<void>;
  }>,
) {
  const { label, isEdit, playing } = camelizeProps(props);

  async function handleDelete() {
    await window.$confirm({ title: "删除操作", content: "确定删除该案例吗？" });
    context.emit("delete");
  }

  return (
    <div class="listlation-case-list-item dot-border flex items-center p-3">
      <span class="icon mr-2">
        <i class="i-svg-icon-raw-line-chart"></i>
      </span>
      <span class="inline-block flex-auto text-[16px] text-white">{label}</span>
      {
        playing && (
          <span class="flex-auto text-[12px] text-[#828282]">
            模拟中，剩余
            <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[22px] text-transparent leading-none font-number">10</span>
            分钟
          </span>
        )
      }
      {
        isEdit
          ? (
              <button
                type="button"
                class="size-[26px] flex shrink-0 items-center justify-center border-[#CC1A1A] rounded-full bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% !bg-gradient-to-b"
                onClick={() => handleDelete()}
              >
                <i class="i-ri-delete-bin-7-fill text-[12px]"></i>
              </button>
            )
          : (
              playing
                ? (
                    <button type="button" class="size-[26px] flex shrink-0 items-center justify-center border border-[#CC1A1A] rounded-full bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% !bg-gradient-to-b">
                      <i class="i-svg-reset-cloudy-loading text-[12px]"></i>
                    </button>
                  )
                : (
                    <button type="button" class="size-[26px] flex shrink-0 items-center justify-center border border-[#CC1A1A] rounded-full bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% !bg-gradient-to-b">
                      <i class="i-ri-play-fill text-[12px]"></i>
                    </button>
                  )
            )
      }

    </div>
  );
}

const [isEdit, setIsEdit] = useState(false);

function handleDelte() {
  return Promise.resolve("-----");
}
</script>

<template>
  <UiBoxPanel title="仿真案例" class="row-span-8">
    <template #titleSuffix>
      <button
        v-if="!isEdit"
        type="button"
        class="ml-2 inline-flex items-center border border-[#CC1A1A] rounded rounded-full bg-[#571414]/80 px-2 py-0.5 text-[12px] text-white opacity-80 hover:opacity-100"
        @click="() => setIsEdit(true)">
        <i class="i-ri-edit-2-fill mr-1" />
        编辑
      </button>
      <button
        v-else
        type="button"
        class="border border-[#A94C4C] rounded bg-[#6C2020]/20 px-2 py-0.5 text-[#FFD5D5] opacity-80 hover:opacity-100"
        @click="() => setIsEdit(false)">
        取消
      </button>
    </template>
    <div class="max-h-[240px] overflow-y-auto px-2 space-y-3">
      <ListlationCaseList label="漫游路线" :is-edit="isEdit" :playing="false" @delete="handleDelte" />
      <ListlationCaseList label="漫游路线" :is-edit="isEdit" :playing="true" />
      <ListlationCaseList label="漫游路线" :is-edit="isEdit" :playing="false" />
    </div>
    <div class="px-5">
      <button
        type="button"
        class="relative mx-auto mt-3 flex items-center justify-center gap-2 border border-[#CC1A1A] bg-transparent from-[#DC2F2F]/20 via-[#DC2F2F]/75 to-transparent via-75% px-8 py-1 text-[14px] !bg-gradient-to-b"
        @click="emit('add')">
        <span class="absolute left-[-3px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
        <span class="absolute right-[-2px] top-1/2 inline-block size-[4px] bg-[#EABC8B] -translate-y-1/2" />
        <i class="i-ri-add-circle-line" />
        新增模拟
      </button>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
</style>
