<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useState } from "@/hooks";
import { useI18nStore } from "@/stores/i18n.ts";
import { useUserStore } from "@/stores/user.ts";
import { localWeather } from "@/utils/localWeather.ts";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";
import AnniversaryBtn from "./components/AnniversaryBtn/index.vue";
import LayerControl from "./components/LayerControl/index.vue";
import WeatherControl from "./components/WeatherControl/index.vue";

defineOptions({ name: "HeaderNav" });

const i18nStore = useI18nStore();
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const formatted = useDateFormat(
  useNow(),
  computed(() => i18nStore.lang === "zhCN" ? "YYYY年MM月DD日 HH:mm:ss" : "MMM D, YYYY h:mm:ss A"),
  {
    locales: computed(() => i18nStore.lang === "zhCN" ? "zh-cn" : "en-US"),
  },
);

const [showLayerControl, setShowLayerControl] = useState(false);

// 点击“logo”回到初始视角
function logoClick() {
  const jsondata = {
    targetPosition: [121.50088967397845, 31.29153510205151, 516.557733098433],
    rotation: { pitch: -30.000194549560547, yaw: -90.00012969970703 },
    distance: 200,
    flyTime: 1,
  };
  wdpMap.app?.CameraControl.FlyTo(jsondata);
}

async function handleLogout() {
  await window.$confirm({ title: t("message.logout"), content: t("message.logoutTip") });
  userStore.logoutAction();
  await router.push("/login");
}

const cityInfo = ref({ cityName: "", weather: "" });
onMounted(async () => {
  await localWeather.init();
  const { city = "上海市", dayweather = "晴" } = localWeather.weatherInfo as any;
  cityInfo.value = { cityName: city, weather: dayweather };
});
</script>

<template>
  <header class="header-nav pointer-events-auto absolute left-0 right-0 top-0 h-85px flex items-start justify-start">
    <div class="logo h-80px w-450px flex items-center justify-start" @click="logoClick">
      <img src="@/assets/images/logo.png" alt="logo" class="mx-2.5 wh-50px">
      <GradientText
        class="leading-none font-title text-shadow-[0px_13px_12px_#3F447542]"
        :deg="0"
        :colors="{ 17: 'rgba(157, 164, 221, 0.01)', 47: 'rgba(157, 164, 221, 0.49)', 76: 'rgba(157, 164, 221, 0.01)', 100: '#fff' }">
        <span class="mb-1 block text-32px tracking-widest">复旦大学数智孪生校园</span>
        <span class="block text-14px">Fudan University Digital Twin Campus</span>
      </GradientText>
    </div>
    <div id="header-nav-placeholder" class="h-45px flex-auto" />
    <div class="ml-3 mt-1 flex pr-3 space-x-2">
      <!--   校庆按钮   -->
      <AnniversaryBtn />

      <button class="cursor-pointer bg-transparent wh-36px" :title="$t('headerToolbar.layerControl')" @click="setShowLayerControl(true)">
        <img src="@/assets/images/tree-icon.png" alt="icon">
      </button>
      <!--   天气控制   -->
      <WeatherControl />

      <button class="cursor-pointer bg-transparent wh-36px" :title="$t('headerToolbar.signOut')" @click="handleLogout">
        <img src="@/assets/images/red/layout/logout-btn.png" alt="icon">
      </button>
      <HasPermission permission="admin">
        <button class="cursor-pointer bg-transparent wh-36px" :title="$t('headerToolbar.adminMgr')" @click="$router.push('/admin')">
          <img src="@/assets/images/login.png" alt="icon">
        </button>
      </HasPermission>
    </div>
    <div class="absolute bottom-0 right-0 h-35px flex flex-shrink-0 items-center gap-5 children:flex-shrink-0">
      <CampusSelector />
      <I18nSwitch />
      <div class="pr-5 text-18px text-#E2E3F3">
        <span class="font-number">{{ formatted }}</span>
        <span class="mx-5">{{ cityInfo.cityName }}</span>
        <span>天气：{{ cityInfo.weather }}</span>
      </div>
    </div>
  </header>

  <TransitionFadeIn>
    <LayerControl v-show="showLayerControl" class="pointer-events-auto absolute right-100px top-36px z-99" @close="setShowLayerControl(false)" />
  </TransitionFadeIn>
</template>

<style scoped lang="scss">
.header-nav {
  background:
    url("@/assets/images/red/layout/header-left.png") no-repeat left top,
    url("@/assets/images/red/layout/header-right.png") no-repeat right top;
  background-size:
    425px 83px,
    calc(100% - 420px) 83px;
}
</style>
