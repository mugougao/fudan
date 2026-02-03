<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useI18nStore } from "@/stores/i18n.ts";
import { useUserStore } from "@/stores/user.ts";
import { cn } from "@/utils";

defineOptions({ name: "HeaderNav" });

const router = useRouter();
const i18nStore = useI18nStore();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const { t } = useI18n();

async function handleLogout() {
  await window.$confirm({ title: t("message.logout"), content: t("message.logoutTip") });
  userStore.logoutAction();
  await router.push("/login");
}

async function handleChangeLange({ key }) {
  // console.log("=>(index.vue:23) args", args);
  i18nStore.setLang(key);
}
</script>

<template>
  <header class="header-nav fixed left-300px right-0 top-0 z-999 h-70px w-[calc(100%-300px)] flex items-center bg-white shadow">
    <div class="ml-auto flex items-center px-5 text-16px">
      <span class="flex items-center gap-2">
        <!--
          <img
          :src="`https://placehold.co/40/000000/FFF?font=poppins&text=${userInfo.username.slice(0, 1)}`"
          alt="user-icon"
          class="h-40px w-40px rounded-full transition-all hover:scale-120">
          -->
        <span class="flex-center rounded-full bg-gray-200 text-blue-500 transition-all wh-40px hover:scale-120">
          <i class="i-ri-user-3-line" />
        </span>
        <span>{{ userInfo.username }}</span>
      </span>
      <ADivider type="vertical" />

      <ATooltip placement="bottom" title="大屏">
        <button
          class="btn-menu"
          :class="cn(
            'rounded-lg bg-white px-3 py-1.5',
            'hover:bg-gray-100',
            'focus:ring-2 focus:ring-offset-2 focus:ring-[#1677ff]',
          )"
          @click="$router.push('/')">
          <i class="i-ri-computer-line" />
        </button>
      </ATooltip>

      <ADivider type="vertical" />
      <ADropdown :trigger="['click']" placement="bottom" arrow>
        <button
          class="btn-menu"
          :class="cn(
            'rounded-lg bg-white px-3 py-1.5',
            'hover:bg-gray-100',
            'focus:ring-2 focus:ring-offset-2 focus:ring-[#1677ff]',
          )">
          <i class="i-ri-translate-2" />
        </button>
        <template #overlay>
          <AMenu :selected-keys="[i18nStore.lang]" @click="handleChangeLange">
            <AMenuItem key="zhCN">
              <i class="i-icon-park-outline-chinese" />
              <span class="ml-3">中文</span>
            </AMenuItem>
            <AMenuItem key="en">
              <i class="i-icon-park-outline-english" />
              <span class="ml-3">English</span>
            </AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
      <ADivider type="vertical" />
      <button
        type="button"
        :class="cn(
          'flex items-center gap-1 rounded-lg bg-white px-3 py-1.5',
          'hover:bg-gray-100',
          'focus:ring-2 focus:ring-offset-2 focus:ring-[#1677ff]',
        )"
        @click="handleLogout">
        <i class="i-ri-logout-box-r-line text-[#1677ff]" />
        <span>登出</span>
      </button>
    </div>
  </header>
</template>

<style scoped>

</style>
