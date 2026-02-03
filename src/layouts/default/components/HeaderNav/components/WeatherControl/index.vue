<script setup lang="ts">
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import { useState } from "@/hooks/useState.ts";
import { cn } from "@/utils";
import wdpMap from "@/utils/WdpMap/wdpMap.ts";

defineOptions({ name: "WeatherControl" });

const weather = ref(false);

// 点击天气按钮
function weatherBtn() {
  weather.value = true;
  // cloudMap?.SuperAPI("SetEnvWeather", { env_weather: "Sunny" });
}

// 时间
const [timeValue] = useState(12);
const [timeAuto] = useState(false);
// 光线
const [lightValue, setLightValue] = useState("12:00");
const [lightAuto] = useState(false);
// 天气
const [weatherValue, setWeatherValue] = useState("Sunny");
const [weatherAuto] = useState(false);

const lightList = [
  { name: "早晨", icon: "i-ri-sun-line", env_time: "09:00" },
  { name: "中午", icon: "i-ri-sun-line", env_time: "12:00" },
  { name: "日落", icon: "i-ri-sun-line", env_time: "18:00" },
  { name: "夜晚", icon: "i-ri-moon-cloudy-line", env_time: "21:00" },
];
const weatherList = [
  { name: "晴天", icon: "i-ri-sun-line", env_weather: "Sunny" },
  { name: "阴天", icon: "i-ri-cloudy-line", env_weather: "Overcast" },
  { name: "多云", icon: "i-ri-sun-cloudy-line", env_weather: "Cloudy" },
  { name: "雾", icon: "i-ri-cloud-windy-line", env_weather: "Foggy" },
  { name: "小雨", icon: "i-ri-drizzle-line", env_weather: "LightRain" },
  { name: "中雨", icon: "i-ri-showers-line", env_weather: "ModerateRain" },
  { name: "大雨", icon: "i-ri-heavy-showers-line", env_weather: "HeavyRain" },
  { name: "小雪", icon: "i-ri-hail-line", env_weather: "LightSnow" },
  { name: "中雪", icon: "i-ri-snowy-line", env_weather: "ModerateSnow" },
  { name: "大雪", icon: "i-ri-snowflake-line", env_weather: "HeavySnow" },
];

const { resume, pause, isActive } = useIntervalFn(() => {
  const time = dayjs().format("HH:mm");
  wdpMap.app?.Environment.SetSkylightTime(time, 2, false);
}, 1000 * 60 * 30, { immediate: false, immediateCallback: true });

function setTimeOrLight(time: string) {
  if (isActive.value) pause();
  wdpMap.app?.Environment.SetSkylightTime(time, 2, false);
}

// 时间自动
watch(
  timeAuto,
  (checked) => {
    if (checked) {
      resume();
      return;
    }
    const time = `${timeValue.value.toString().padStart(2, "0")}:00`;
    setTimeOrLight(time);
  },
);

// 光线自动
watch(
  lightAuto,
  (checked) => {
    if (checked) {
      resume();
      return;
    }
    setTimeOrLight(lightValue.value);
  },
);

// 天气自动
watch(
  weatherAuto,
  (checked) => {
    wdpMap.app?.Environment.SetSceneWeather(
      checked ? "auto" : weatherValue.value,
      2,
      false,
    );
  },
);

// 时间切换
const timeChange = debounce((value) => {
  if (timeAuto.value) return;
  const time = `${value.toString().padStart(2, "0")}:00`;
  setTimeOrLight(time);
}, 500);

// 点击天气切换
function weatherClick(item: any) {
  if (weatherAuto.value) return;
  setWeatherValue(item.env_weather);
  wdpMap.app?.Environment.SetSceneWeather(item.env_weather, 2, false);
}

// 点击光线切换
function lightClick(item: any) {
  if (lightAuto.value) return;
  setLightValue(item.env_time);
  setTimeOrLight(item.env_time);
}
</script>

<template>
  <div class="action-btn-box">
    <button class="action-btn" :title="$t('headerToolbar.weatherControl')" @click="weatherBtn">
      <i class="i-svg-icon-weathe-control" />
    </button>
  </div>

  <MapPopup
    v-model:visible="weather" title="" :width="280" top="100px"
    left="1650px">
    <template #title>
      <h4 class="-mx-5">
        {{ $t('headerToolbar.weatherControl') }}
      </h4>
    </template>
    <div class="flex flex-col gap-y-2 -mx-2 divide-y-1 divide-white [&>section>header]:py-2">
      <section>
        <header class="flex items-center gap-1">
          <i class="i-ri-time-line text-base" />
          <span>时间</span>
          <span class="ml-auto">实时</span>
          <a-switch v-model:checked="timeAuto" size="small" />
        </header>
        <div class="px-3 -mt-2">
          <ASlider
            v-model:value="timeValue"
            :disabled="timeAuto"
            :tooltip-open="false"
            class="map-slider"
            :max="23"
            :min="0"
            :step="1"
            :marks="{ 0: '0:00', 4: '4:00', 8: '8:00', 12: '12:00', 16: '16:00', 20: '20:00', 23: '23:00' }"
            @change="timeChange">
            <template #mark="{ label }">
              <span class="inline-block text-11px text-white">{{ label }}</span>
            </template>
          </ASlider>
        </div>
      </section>

      <section>
        <header class="flex items-center gap-1">
          <i class="i-ri-sun-line text-base" />
          <span>光线</span>
          <span class="ml-auto">实时</span>
          <a-switch v-model:checked="lightAuto" size="small" />
        </header>

        <ul class="grid grid-cols-4 gap-2">
          <li
            v-for="(item) in lightList" :key="item.name"
            :class="cn(
              'flex-col items-center',
              lightAuto
                ? 'text-gray-500 cursor-not-allowed'
                : lightValue === item.env_time ? 'text-[#FFA399]' : 'text-white  cursor-pointer',
            )"
            @click="lightClick(item)">
            <i class="text-xl" :class="[item.icon]" />
            <span class="text-xs">{{ item.name }}</span>
          </li>
        </ul>
      </section>

      <section>
        <header class="flex items-center gap-1">
          <i class="i-ri-windy-line text-base" />
          <span class="mr-auto">天气</span>
          <span class="mr-1">实时</span>
          <a-switch v-model:checked="weatherAuto" size="small" />
        </header>
        <ul class="grid grid-cols-4 gap-2">
          <li
            v-for="(item) in weatherList" :key="item.name"
            :class="cn(
              'flex-col items-center',
              weatherAuto
                ? 'text-gray-500 cursor-not-allowed'
                : weatherValue === item.env_weather ? 'text-[#FFA399]' : 'text-white  cursor-pointer',
            )"
            @click="weatherClick(item)">
            <i class="text-xl" :class="[item.icon]" />
            <span class="text-xs" :class="[{ color: weatherValue === item.env_weather }]">{{ item.name }}</span>
          </li>
        </ul>
      </section>
    </div>
  </MapPopup>
</template>

<style scoped>

</style>
