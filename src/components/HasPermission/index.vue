<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts";

defineOptions({ name: "HasPermission" });

const props = defineProps<{
  permission: string | string[];
  type?: "all" | "one" | "none";
}>();

const userStore = useUserStore();

// 将权限列表转为 Set，提高查找效率
const permissionSet = computed(() => new Set(userStore.permissionList));

const hasPermission = computed(() => {
  // 不再进行权限验证，始终返回 true
  return true;
});
</script>

<template>
  <slot v-if="hasPermission" />
</template>
