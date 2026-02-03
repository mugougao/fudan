<script setup lang="tsx">
import type { ProjectScheduleListItemProps } from "./ProjectScheduleListItem.vue";
import { cn } from "@/utils";
import { env } from "@/utils/env.ts";
import ProjectScheduleListItem from "./ProjectScheduleListItem.vue";
import treeOptionsMap from "./treeOptionsMap.json";

defineOptions({ name: "ProjectScheduleList", inheritAttrs: false });

const data: ProjectScheduleListItemProps[] = [
  { time: "2021.12.02", content: "", status: "default", statusText: "竣工验收" },
  { time: "2021.12.02", content: "2021.12.02复旦大学江湾校区融合创新二号楼施工许可证", status: "success", statusText: "施工许可" },
  { time: "2021.11.12", content: "勘察设计中标通知书-融二", status: "success", statusText: "招投标" },
  { time: "2021.11.04", content: "江湾校区融合创新二号楼审图合格证（2021-11-04）", status: "success", statusText: "设计审查" },
  { time: "2021.9.29", content: "2021.07.22融合创新二号楼规划土地意见书批复", status: "success", statusText: "工程规划" },
  { time: "2021.9.15", content: "38.江湾校区1【沪（2021）杨字不动产权第025702号】", status: "success", statusText: "用地批复" },
  { time: "2020.7.22", content: "2020.7.22 教育部发展规划司关于复旦大学江湾校区融合创新二号楼备案意见的函", status: "success", statusText: "立项" },
];

const showFilePopup = ref(false);
const progressKey = ref("");
const treeOptions = computed(() => treeOptionsMap[progressKey.value] || []);
const inPreviewFile = ref<string | undefined>(undefined);

watch(
  treeOptions,
  () => {
    const target = treeOptions.value.find(item => !item.children && item.selectable);
    inPreviewFile.value = target?.value;
  },
);
function handleItemClick(item: ProjectScheduleListItemProps) {
  progressKey.value = item.statusText;
  showFilePopup.value = true;
}
</script>

<template>
  <div :class="cn('project-schedule-list px-3', $attrs.class || '')">
    <ProjectScheduleListItem
      v-for="({ time, content, status, statusText }) in data" :key="statusText"
      :time="time" :content="content" :status="status" :status-text="statusText"
      @item-click="handleItemClick" />

    <DragPopup v-model:visible="showFilePopup" title="文件详情" width="1200px" top="20px" left="auto">
      <template #title>
        <div class="flex items-center gap-5">
          <span class="shrink-0">文件详情</span>
          <ATreeSelect v-model:value="inPreviewFile" :tree-data="treeOptions" class="flex-auto">
            <template #title="{ label, selectable, chidlren, expanded }">
              <span v-if="!chidlren && !selectable">
                <i :class="!expanded ? 'i-ri-folder-3-fill' : 'i-ri-folder-5-fill'" />
                {{ label }}
              </span>
              <template v-else>
                <i class="i-ri-file-list-2-line" />
                {{ label }}
              </template>
            </template>
          </ATreeSelect>
        </div>
      </template>

      <div class="h-[900px]">
        <iframe :src="`${env.VITE_HTTP_ASSETS_URL}/file${inPreviewFile}`" class="h-full w-full" frameborder="0" />
      </div>
    </DragPopup>
  </div>
</template>

<style scoped lang="scss">

</style>
