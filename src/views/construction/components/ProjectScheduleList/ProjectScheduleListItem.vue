<script setup lang="tsx">
import { cn } from "@/utils";
import treeOptionsMap from "./treeOptionsMap.json";

defineOptions({ name: "ProjectScheduleListItem", inheritAttrs: false });
const { time, content, status, statusText } = defineProps<ProjectScheduleListItemProps>();

const emit = defineEmits<{
  itemClick: [params: ProjectScheduleListItemProps];
}>();

export interface ProjectScheduleListItemProps {
  time: string;
  content: string;
  status: "success" | "warning" | "error" | "default";
  statusText: string;
}

const colorNames = {
  default: "border border-white text-white/80 bg-gradient-to-b from-white/10 via-white/20 to-transparent to-150%",
  success: "border border-[#CC1A1A] text-white bg-gradient-to-b from-[#CC1A1A]/20 via-[#CC1A1A]/75 to-transparent to-150%",
  warning: "text-[#F5A623]",
  error: "text-[#EB5757]",
};

const contentRef = useTemplateRef<HTMLDivElement>("content");
const isOverflow = ref(false);
const expand = ref(false);
const expandHeight = ref(0);
onMounted(() => {
  const { scrollHeight, clientHeight } = contentRef.value!;
  expandHeight.value = scrollHeight;
  isOverflow.value = scrollHeight > clientHeight;
});

const treeList = computed(() => treeOptionsMap[statusText]);

function TreeRender({ data = [], isChildren }: { data: any[];isChildren?: boolean }) {
  return (
    data.map(({ label, children }) => (
      <div class="relative py-0.5 text-xs text-white/60">
        { isChildren && <span class="absolute left-[-12px] top-10px block h-[1px] w-[10px] bg-white"></span>}
        <div class="flex">
          <span>
            <i class={cn(
              "bg-gradient-to-b from-red to-white",
              children ? "i-svg-icon-folder" : "i-svg-icon-pdf",
            )}
            />
          </span>
          <span class="ml-1 flex-auto">{label}</span>
        </div>
        <div class="ml-2 border-l pl-3">
          {children && TreeRender({ data: children, isChildren: true })}
        </div>
      </div>
    ))
  );
}
</script>

<template>
  <div
    class="project-schedule-list-item relative border-l border-white/20 border-dashed" :class="status !== 'default' && 'group'"
    @click="() => status !== 'default' && emit('itemClick', { time, content, status, statusText })">
    <span
      :class="cn(
        'absolute  flex items-center justify-center rounded-full ',
        status === 'success' ? 'left-[-10px] top-[-8px] size-[20px] bg-[#4F0D0D] border border-[#CC1A1A]' : 'left-[-6px] top-[-4px] size-[12px] bg-[#999999] border border-white/60',
      )">
      <i v-if="status === 'success'" class="i-ri-check-line text-xs" />
    </span>
    <div class="pb-3 pl-4 pr-2 -translate-y-2.5">
      <div class="mb-1 flex items-center justify-between">
        <span
          :class="cn('flex items-center gap-0.5 font-text-medium text-[14px] min-w-[80px] justify-center px-2', colorNames[status] ?? 'text-[#d8d8d8]')">
          {{ statusText }}
        </span>
        <span v-if="status !== 'default'" class="text-[14px] text-white/60 font-text-medium">{{ time }}</span>
      </div>
      <div
        :class="cn(
          'project-schedule-list-item-content',
          'relative border border-[#FFF3F3]/20 bg-[#000A17]/30 text-[14px] text-white/60',
          'p-1.5 has-[input]:pb-1',
          'group-hover:border-[#9FE4FF] group-hover:text-white',
        )">
        <div ref="content" class="overflow-hidden" :style="{ height: expand ? `${expandHeight}px` : '66px' }">
          <TreeRender :data="treeList" />
        </div>
        <label
          v-if="isOverflow"
          class="bottom-0 block flex cursor-pointer items-center justify-center text-[12px] text-[#7A7A7A] leading-none hover:text-white"
          @click.stop>
          <input v-model="expand" type="checkbox" class="peer hidden">
          <i class="i-ri-arrow-down-s-line peer-checked:rotate-180" />
          {{ expand ? "收起" : "展开" }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-schedule-list-item {
  &:has(input:not(:checked)) {
    .project-schedule-list-item-content {
      & > div {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        mask: linear-gradient(to top, transparent 0%, #000 30%);
      }
    }
  }
}
</style>
