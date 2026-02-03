<script setup lang="ts">
import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import { fetchCampusAssetsTypeByCollege } from "@/api/assetManagement/campusAssets.ts";
import { getAllCollege } from "@/api/commons";
import { CampusId, campusIdFormat } from "@/enums";
import { cn, highlightText } from "@/utils";
import campusAssetsTypeWithCollegePoiLayer from "@/utils/WdpMap/assetManagement/campusAssets/CampusAssetsTypeWithCollegePoiLayer.ts";
import campusPoiLayer from "@/utils/WdpMap/CampusPoiLayer.ts";

defineOptions({ name: "FacultyAssetQuery", inheritAttrs: false });
const campusId = useRouteQuery<CampusId>("campusId", CampusId.Overview) as unknown as Ref<CampusId>;

const searchText = ref("");

const { state, execute } = useAsyncState(
  async () => {
    const [err, res] = await to(fetchCampusAssetsTypeByCollege(searchText.value));
    if (err) return [];
    return (res?.resultData || []).map(({ campus, sl, je }) => {
      return { name: campus?.replace("校区", ""), number: sl, amount: je };
    });
  },
  [],
  {
    resetOnExecute: false,
  },
);

const facultiesQueryFlag = ref("");
function setFacultiesQueryFlag(value: string) {
  if (value === facultiesQueryFlag.value) {
    facultiesQueryFlag.value = "";
    return;
  }
  facultiesQueryFlag.value = value;
}

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
  execute();
}
// 选中
async function onSelect(_value) {
  searchText.value = _value;
  execute();
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

watch(
  () => facultiesQueryFlag.value,
  async (value) => {
    try {
      // 删除之前 poi
      await campusAssetsTypeWithCollegePoiLayer.removeAll();
      // 取消显示
      if (value === "") {
        await campusPoiLayer.showAll();
        return;
      }
      // 显示 poi
      await campusPoiLayer.hideAll();
      await campusAssetsTypeWithCollegePoiLayer.render(value as string, searchText.value);
    }
    catch (e) {
      console.log("=>(index.vue:47) e", e);
    }
  },
);

defineExpose({
  searchText,
});
</script>

<template>
  <UiBoxPanel title-path="assetMgr.facultyAssetQuery" class="row-span-13" content-class-name="flex flex-col">
    <div class="shrink-0 px-2">
      <AAutoComplete
        v-model:value="searchText"
        class="!w-full"
        :options="options" popup-class-name="faculties-query-popup" :style="{ width: '200px' }" allow-clear
        @search="handleSearch" @select="onSelect" @clear="handleClear">
        <AInput :placeholder="$t('largeInstruments.pleaseEnterFaculties')" @press-enter="() => handleSearch()">
          <template #prefix>
            <i class="i-ri-search-line" />
          </template>
        </AInput>
        <template #option="{ value: val }">
          <div class="truncate text-white" v-html="highlightText(val, searchText)" />
        </template>
      </AAutoComplete>
    </div>

    <div class="search-result flex-auto overflow-hidden py-2">
      <EmptyWrapper :is-empty="!state?.length">
        <ul class="search-result-list wh-full overflow-y-auto whitespace-nowrap px-2 space-y-3">
          <li
            v-for="item in state" :key="item.name"
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
                  <span class="from-red to-white bg-gradient-to-b bg-clip-text text-[12px] text-transparent font-text-bold">{{ $t('assetMgr.assetsTotal2') }}</span>
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
      </EmptyWrapper>
    </div>
  </UiBoxPanel>
</template>

<style scoped lang="scss">
.faculties-query-popup {
  :deep(.ant-select) {
    .ant-select-clear {
      background-color: transparent;
      color: #c35454;
    }
  }
}
</style>

<style lang="scss">
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
