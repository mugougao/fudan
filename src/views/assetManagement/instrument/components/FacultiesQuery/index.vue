<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { getAllCollege } from "@/api/commons";
import { useStatusFlag } from "@/composables/assetManagement/instrument.ts";
import { CampusId, campusIdFormat } from "@/enums";
import { cn } from "@/utils";
import campusWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/instrument/CampusWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";

defineOptions({ name: "FacultiesQuery" });
const { data } = defineProps<IProps>();
const emit = defineEmits<{
  search: [text: string];
}>();
const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;
export interface IProps {
  data: { name: string; number: number; amount: number }[];
}

const searchText = ref("");
// 选项 options
const options = ref<{ value: string }[]>([]);
const { state: optionsSource } = useAsyncState(
  async () => {
    const campusName = campusIdFormat(campusId.value);
    const [err, res] = await to(getAllCollege({ xq: campusName }));
    if (err) return [];
    return (res?.resultData || []).map(item => ({ value: item }));
  },
  [] as { value: string }[],
  {
    resetOnExecute: false,
    onSuccess: data => (options.value = data),
  },
);

// 清除输入框内容
function handleClear() {
  searchText.value = "";
  emit("search", "");
}
// 选中
async function onSelect(_value) {
  searchText.value = _value;
  emit("search", _value);
}
// 搜索
function handleSearch() {
  if (!searchText.value) {
    options.value = optionsSource.value;
    return;
  }
  options.value = optionsSource.value.reduce((acc, cur) => {
    return cur.value.includes(searchText.value) ? [...acc, cur] : acc;
  }, [] as { value: string }[]);
}
// 高亮搜索结果
function highlightText(text: string) {
  return text.replace(new RegExp(searchText.value, "gi"), match => `<span class="text-red">${match}</span>`);
}

const { facultiesQueryFlag, isLoading, resetOtherFlag, waitForLoadingEnd } = useStatusFlag();
function setFacultiesQueryFlag(name: string) {
  resetOtherFlag("facultiesQueryFlag");
  facultiesQueryFlag.value = facultiesQueryFlag.value === name ? "" : name;
}

watch(
  () => facultiesQueryFlag.value,
  async (value) => {
    await waitForLoadingEnd();
    try {
      isLoading.value = true;
      // 删除之前 poi
      await campusWithCollegePoiLayer.removeAll();
      // 取消显示
      if (value === "") {
        await campusPoiLayer.showAll();
        return;
      }
      // 显示 poi
      await campusPoiLayer.hideAll();
      await campusWithCollegePoiLayer.renderCampusWithCollege(value as string, searchText.value);
    }
    catch (e) {
      console.log("=>(index.vue:47) e", e);
    }
    finally {
      isLoading.value = false;
    }
  },
);

function handleOnSearch(value: string) {
  return Array.from(
    campusWithCollegePoiLayer.layerDataMap.values(),
  ).reduce((prev, { name, id }) => {
    if (!name.includes(value)) return prev;
    prev.push({ name, id });
    return prev;
  }, [] as any[]);
}
</script>

<template>
  <div class="faculties-query mt-2 h-[340px] flex flex-col shrink-0 px-1">
    <!-- <PoiSearch
      v-if="facultiesQueryFlag"
      class="ml-auto mt-1.5" width="300px" :on-search="handleOnSearch"
      @select="({ id }) => campusWithCollegePoiLayer.focus(id)" /> -->

    <UiSubTitle title-path="largeInstruments.facultiesQuery" class="shrink-0" />
    <div class="mt-1 shrink-0">
      <AAutoComplete
        v-model:value="searchText"
        class="!w-full"
        :options="options" popup-class-name="faculties-query-popup" allow-clear
        @search="handleSearch" @select="onSelect" @clear="handleClear">
        <AInput :placeholder="$t('largeInstruments.pleaseEnterFaculties')" @press-enter="() => handleSearch()">
          <template #prefix>
            <i class="i-ri-search-2-line" />
          </template>
        </AInput>
        <template #option="{ value: val }">
          <div class="truncate text-white" v-html="highlightText(val)" />
        </template>
      </AAutoComplete>
    </div>

    <div class="search-result flex-auto overflow-hidden py-2">
      <EmptyWrapper :is-empty="!data.length">
        <ul class="search-result-list wh-full overflow-y-auto whitespace-nowrap px-2 space-y-3">
          <li
            v-for="item in data" :key="item.name"
            class="flex"
            :class="cn(item.name === facultiesQueryFlag && 'active')"
            @click="setFacultiesQueryFlag(item.name)">
            <div class="dot-border size-[80px] shrink-0 p-1.5">
              <div class="h-full w-full flex flex-col items-center justify-center border border-[#CC1A1A] bg-[#CC1A1A]/20 text-[#FFE5E5]">
                <i class="i-ri-hotel-bed-fill text-2xl" />
                <span class="text-[14px] font-title">{{ item.name }}</span>
              </div>
            </div>

            <div class="dot-border ml-2 h-[80px] flex-auto overflow-hidden">
              <div class="content-box flex items-center justify-between p-1.5 px-3">
                <span class="flex flex-col items-center">
                  <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-text-bold">{{ $t('largeInstruments.totalDevices') }}</span>
                  <span class="text-[20px] font-number">{{ item.number }}</span>
                  <span class="text-[10px] text-[#9E9E9E]">(台)</span>
                </span>
                <span class="flex flex-col items-center">
                  <span class="from-[#F7C998] to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-text-bold">{{ $t('largeInstruments.totalAmount') }}</span>
                  <span class="text-[20px] font-number">{{ item.amount }}</span>
                  <span class="text-[10px] text-[#9E9E9E]">(万元)</span>
                </span>
              </div>
            </div>
          </li>
        </ul>

        <!-- <ul class="search-result-list wh-full overflow-y-auto whitespace-nowrap space-y-3">
          <li
            v-for="item in data" :key="item.name"
            :class="cn(
              'h-60px flex items-center border  bg-#0D141B px-5 cursor-pointer',
              item.name === facultiesQueryFlag ? 'border-#18FEFE' : 'border-#313940 hover:border-#18FEFE',
            )"
            @click="setFacultiesQueryFlag(item.name)">
            <div class="w-150px flex items-center text-28px font-title">
              <img src="@/assets/images/campusAccess/icon-build.png" alt="icon" class="h-46px w-70px">
              <span
                :class="[item.name === facultiesQueryFlag ? 'bg-gradient-to-b from-#18fefe to-white text-transparent bg-clip-text' : 'text-#CDCDCD']">
                {{ item.name }}
              </span>
            </div>
            <div class="w-120px flex flex-col items-center">
              <span class="text-14px text-#D4D4D4">{{ $t('largeInstruments.totalDevices') }}</span>
              <span class="text-18px text-#BED0DB font-text-medium">{{ item.number }}台</span>
            </div>
            <div class="w-120px flex flex-col items-center">
              <span class="text-14px text-#D4D4D4">{{ $t('largeInstruments.totalAmount') }}</span>
              <span class="text-18px text-#BED0DB font-text-medium">{{ item.amount }}万元</span>
            </div>
          </li>
        </ul> -->
      </EmptyWrapper>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-result-list li {
  & > div {
    .content-box {
      background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat 90px / 1px 80%;
    }
  }

  &.active > div {
    background:
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat left top / 2px 2px,
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat left bottom / 2px 2px,
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat right top / 2px 2px,
      linear-gradient(to right, #ffe5e5, #ffe5e5) no-repeat right bottom / 2px 2px,
      linear-gradient(to right, #fff3f30f, #fff3f30f) no-repeat left top / 100% 1px,
      linear-gradient(to right, #fff3f30f, #fff3f30f) no-repeat left bottom / 100% 1px,
      linear-gradient(to right, #fff3f30f, #fff3f30f) no-repeat left top / 1px 100%,
      linear-gradient(to right, #fff3f30f, #fff3f30f) no-repeat right top / 1px 100%,
      linear-gradient(to right, rgba(#cc1a1a, 0.4), rgba(#cc1a1a, 0.4)) no-repeat right top / 100% 100%;
  }
}
</style>
