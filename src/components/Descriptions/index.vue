<script setup lang="ts">
import type { VNode } from "vue";
import get from "lodash/get";
import { cn } from "@/utils";

defineOptions({ name: "Descriptions", inheritAttrs: false });

const props = defineProps<IDescriptionsProps>();

export interface IDescriptionsProps {
  labelClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  data: any;
  columns: {
    label: string;
    field: string;
    className?: string;
    labelClassName?: string;
    contentClassName?: string;
    render?: (value: any) => string | VNode | VNode[];
  }[];
}
</script>

<template>
  <ul :class="cn('descriptions text-[12px] text-white', $attrs.class ?? '')">
    <li
      v-for="item in props.columns"
      :key="item.field"
      :class="cn('descriptions-item flex', props.itemClassName, item.className)">
      <label class="descriptions-item-label shrink-0 text-white/80" :class="cn(props.labelClassName, item.labelClassName)">
        <span>{{ item.label }}</span>
        <span class="ml-1 mr-2">:</span>
      </label>
      <div class="descriptions-item-content empty-text" :class="cn(props.contentClassName, item.contentClassName)">
        <template v-if="item.render">
          <Component :is="item.render" :value="get(props.data, item.field)" />
        </template>
        <template v-else>
          {{ get(props.data, item.field) }}
        </template>
      </div>
    </li>
  </ul>
</template>

<style scoped>

</style>
