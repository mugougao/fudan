<script setup lang="ts">
import type { ItemType } from "ant-design-vue";
import { asyncRoutes } from "@/router/routes/asyncRoutes.ts";
import { filterRoutes, type Menu, transformRouteToMenu } from "@/router/utils.ts";
import { useUserStore } from "@/stores/user.ts";

defineOptions({ name: "AsideNav" });

const router = useRouter();

const userStore = useUserStore();
const { permissionList } = storeToRefs(userStore);

const navList = computed(() => {
  return navListToMenu(
    transformRouteToMenu(
      // 不再进行权限过滤
      asyncRoutes.find(item => item.name === "admin")?.children || [],
    ),
  );
});

function navListToMenu(menu: Menu[]) {
  return menu.reduce((prev, item) => {
    const { key, label, icon, children } = item;
    const result = {
      key,
      label,
      icon: h("i", { class: icon }),
      title: label,
    };
    if (children && children.length) {
      Object.assign(
        result,
        {
          children: navListToMenu(children),
        },
      );
    }
    prev.push(result);
    return prev;
  }, [] as ItemType[]);
}

function handleClick(item: any) {
  if (!item.key) return;
  if (item.key === router.currentRoute.value.path) return;
  router.push({ name: item.key });
}

const selectedKeys = ref<string[]>([]);
onMounted(() => {
  selectedKeys.value = [router.currentRoute.value.name as string];
});
</script>

<template>
  <aside class="aside-nav fixed left-0 top-0 h-screen w-300px bg-white shadow">
    <section class="h-70px flex items-center justify-center gap-5 px-5">
      <img src="@/assets/images/admin/login.png" alt="logo" class="wh-40px">
      <h1 class="text-center text-24px leading-none font-title">
        复旦大学数智孪生
        <br>
        后台管理系统
      </h1>
    </section>
    <section class="max-h-[calc(100%-70px)]">
      <AMenu v-model:selected-keys="selectedKeys" :items="navList" style="width: 300px" @click="handleClick" />
    </section>
  </aside>
</template>

<style scoped lang="scss">
.aside-nav {
  :deep(.ant-menu) {
    .ant-menu-item {
      @apply relative w-full m-0 h-50px leading-50px rounded-none;
      .ant-menu-item-icon {
        @apply text-16px;
      }
      .ant-menu-title-content {
        @apply text-16px;
      }
      &.ant-menu-item-selected {
        &::after {
          content: "";
          @apply h-full w-4px absolute top-0 right-0 bottom-0 bg-#1677ff;
        }
      }
    }
  }
}
</style>
