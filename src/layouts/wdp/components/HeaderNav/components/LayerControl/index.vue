<script setup lang="ts">
import debounce from "lodash/debounce";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import xor from "lodash/xor";
import toArrayTree from "xe-utils/toArrayTree";
import layerPoint from "@/assets/json/layer-dianwei.json";
import { useState } from "@/hooks";
import { createLoading } from "@/utils/createLoading.ts";
import poiControlLayer from "@/utils/WdpMap/poiControlLayer.ts";
import wdpMap from "@/utils/WdpMap/wdpMap";

defineOptions({ name: "MapLayerControl" });

const emit = defineEmits<{
  close: [];
}>();

interface ITreeDataItem {
  id: number;
  label: string;
  key: string;
  parentLabel: string;
  children?: ITreeDataItem[];
}

const typeCountMap = shallowRef<Record<string, number>>({});
function getTypeCountMap() {
  return Object.entries({
    ...groupBy(layerPoint.features, "properties.lx"),
    ...groupBy(layerPoint.features, "properties.lx2"),
  }).reduce((prev, [key, values]) => ({ ...prev, [key]: values.length }), {} as Record<string, number>);
}
function getTreeData() {
  const result = uniqBy(
    layerPoint.features.reduce((prev, item) => {
      const { lx2, lx, id } = item.properties;
      const result = { id, label: lx2, key: lx2, parentLabel: "" };
      prev.push(result);
      const result2 = { id, label: lx, key: lx, parentLabel: "" };
      if (lx2 !== lx) result2.parentLabel = lx2;
      prev.push(result2);
      return prev;
    }, [] as ITreeDataItem[]),
    "label",
  );

  const treeData = toArrayTree(
    result,
    { children: "children", parentKey: "parentLabel", key: "label" },
  ) as ITreeDataItem[];
  const data = treeData.sort((a, b) => (a?.children?.length || 0) - (b?.children?.length || 0));
  typeCountMap.value = getTypeCountMap();
  return data;
}
const allChecked = ref(false);
const treeData = shallowRef(getTreeData());
const checkedKeys = ref<string[]>([]);
const prevCheckedKeys = ref<string[]>([]);

const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
const searchKey = ref("");
const searchOptions = shallowRef<{ value: string; id: string }[]>([]);
const handleSearch = debounce((searchText: string) => {
  if (!searchText) {
    setAutoCompleteOpen(false);
    return [];
  }
  searchOptions.value = poiControlLayer
    .getRenderedPoiDataListByName(searchText)
    .map(item => ({ value: item.name, id: item.id }));
  setAutoCompleteOpen(!!searchOptions.value.length);
}, 300);
function handleSelect(value: any, option: any) {
  setAutoCompleteOpen(false);
  const id = option?.id || option?.value;
  if (id) {
    poiControlLayer.focusOne(id);
  }
  // pointsLayer.focusCovering(option.id);
}
const searchBoxRef = useTemplateRef<HTMLElement>("searchBox");
onClickOutside(searchBoxRef, () => {
  setAutoCompleteOpen(false);
});

wdpMap.onCreated(() => {
  wdpMap.addLayer(poiControlLayer);
});

onBeforeUnmount(() => {
  wdpMap.removeLayer(poiControlLayer);
});

async function handleCheck(checked: any, info: any) {
  const loading = createLoading({ tip: "点位加载中..." });
  // 提取 checkedKeys 数组
  const checkedKeys = Array.isArray(checked) ? checked : (checked?.checked || []);
  const isChecked = info?.checked !== false;
  
  if (!isChecked) allChecked.value = false;
  try {
    const types = xor(checkedKeys, prevCheckedKeys.value);
    const res = await (isChecked ? poiControlLayer.renderByType(types) : poiControlLayer.removeByType(types));
    prevCheckedKeys.value = checkedKeys;
  }
  finally {
    await poiControlLayer.focusAll();
    loading?.close();
  }
}
function handleAllChange(event: any) {
  const checked = event?.target?.checked || false;
  checkedKeys.value = checked ? Object.keys(typeCountMap.value) : [];
  handleCheck(checkedKeys.value, { checked });
}
</script>

<template>
  <section class="layer-control w-200px">
    <header
      class="flex items-center border border-#A83F3F rounded-t bg-#152C38 px-2 py-1 text-18px shadow-[inset_0_0_12px_0px_#D44949]">
      <img src="@/assets/images/layer-icon.png" alt="icon" class="mr-2 wh-16px">
      <span class="text-18px">图层控制</span>
      <button class="ml-auto cursor-pointer bg-transparent text-14px" @click="emit('close')">
        <i class="i-ri-close-line" />
      </button>
    </header>
    <div
      class="layer-control-main w-full border border-#A83F3F rounded-b bg-#152C38 px-2 py-2 shadow-[inset_0_0_12px_0px_#D44949]">
      <div ref="searchBox" class="search-box pb-2">
        <AAutoComplete
          v-model:value="searchKey" class="w-full" popup-class-name="searchBoxPopup" size="small"
          :open="autoCompleteOpen" :options="searchOptions" @search="handleSearch" @select="handleSelect">
          <div class="custom-input-wrapper relative border border-#CC5E5E/40 rounded">
            <input
              :value="searchKey" type="text" placeholder="请输入点位名称"
              class="w-full bg-transparent py-0.5 pl-1.5 pr-10 text-12px text-white placeholder-color-gray-500"
              @keyup.enter="handleSearch(searchKey)">
            <button
              type="button"
              class="absolute right-0 top-0 h-full w-30px flex-center border border border-#843436 rounded bg-transparent focus:(ring ring-offset-0 ring-#A83F3F)"
              @click="handleSearch(searchKey)">
              <i class="i-ri-search-2-line text-xs text-white" />
            </button>
          </div>
        </AAutoComplete>
      </div>
      <div class="max-h-300px overflow-x-hidden overflow-y-auto">
        <div class="ml-24px">
          <ACheckbox v-model:checked="allChecked" @change="handleAllChange">
            <span class="ml-0">全部显示</span>
          </ACheckbox>
        </div>
        <ATree
          v-model:checked-keys="checkedKeys" checkable :selectable="false" :tree-data="treeData"
          :field-names="{ children: 'children', title: 'label', key: 'label' }" @check="handleCheck">
          <template #title="{ label }">
            <span :title="`${label}(${typeCountMap[label]})`">
              {{ label }} ({{ typeCountMap[label] }})
            </span>
          </template>
        </ATree>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.layer-control {
  .layer-control-main {
    .search-box {
      .custom-input-wrapper:has(input:focus) {
        @apply ring-0.5 ring-#A83F3F ring-offset-0;
      }
      color: red;
    }

    --text-color: #9e9e9e;
    --text-active-color: #8bf7ff;

    :deep(.ant-checkbox-wrapper) {
      .ant-checkbox {
        .ant-checkbox-inner {
          background: transparent;
          border-color: var(--text-color);
          border-radius: 0;
        }

        & + span {
          color: var(--text-color);
        }
      }

      &.ant-checkbox-wrapper-checked,
      &:hover {
        .ant-checkbox {
          .ant-checkbox-inner {
            border-color: var(--text-active-color);
            background-color: transparent;
            border-radius: 0;

            &:after {
              border-color: var(--text-active-color);
            }
          }

          &:after {
            @apply hidden;
          }

          & + span {
            color: var(--text-active-color);
          }
        }
      }
    }

    :deep(.ant-tree) {
      background: transparent;

      .ant-tree-treenode {
        width: 100%;

        .ant-tree-switcher {
          color: #fff;
        }

        .ant-tree-checkbox {
          @apply mr-0;

          .ant-tree-checkbox-inner {
            background: transparent;
            border-color: var(--text-color);
            border-radius: 0;
          }
        }

        .ant-tree-node-content-wrapper {
          color: var(--text-color);
          @apply truncate flex-auto;

          .ant-tree-title {
            @apply truncate block;
          }
        }
      }

      .ant-tree-checkbox.ant-tree-checkbox-indeterminate {
        .ant-tree-checkbox-inner {
          &:after {
            background-color: var(--text-active-color);
          }
        }
      }

      .ant-tree-treenode.ant-tree-treenode-checkbox-checked {
        .ant-tree-checkbox {
          .ant-tree-checkbox-inner {
            &,
            &:after {
              border-color: var(--text-active-color);
            }
          }
        }

        .ant-tree-node-content-wrapper {
          color: var(--text-active-color);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.searchBoxPopup {
  &.ant-select-dropdown {
    @apply border border-#A83F3F rounded bg-#152C38 shadow-[inset_0_0_12px_0px_#D44949] text-white;

    .ant-select-item {
      .ant-select-item-option-content {
        @apply text-white;
      }

      &.ant-select-item-option-active {
        @apply bg-white/20;
      }
    }
  }
}
</style>
