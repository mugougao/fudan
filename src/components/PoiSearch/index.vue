<script setup lang="ts">
import useState from "ant-design-vue/lib/_util/hooks/useState";
import debounce from "lodash/debounce";
import { cn, numberToCss } from "@/utils";

defineOptions({ name: "PoiSearch" });

const { teleport = "#header-nav-placeholder", width = "300px", placeholder = "请输入楼栋名称", onSearch } = defineProps<{
  width?: number | string;
  placeholder?: string;
  onSearch: (value: string) => ({ id: string; name: string }[] | Promise<{ id: string; name: string }[]>);
  teleport?: string | HTMLElement;
}>();

const emit = defineEmits<{
  select: [item: { value: string; id: string }];
}>();

const value = ref("");
const options = ref<{ value: string; id: string }[]>([]);

// 选中
function onSelect(_value, item) {
  value.value = _value;
  emit("select", item);
}
// 搜索
const handleSearch = debounce(async (value: string) => {
  if (!value) {
    options.value = [];
    return;
  }
  let result: ({ id: string | number; name: string }[] | Promise<{ id: string; name: string }[]>) = onSearch(value);
  if (result instanceof Promise) {
    result = await result;
  }
  options.value = result.map(({ name, id }) => ({ value: name, id })) as any[];
}, 200);
// 高亮搜索结果
function highlightText(text: string) {
  return text.replace(new RegExp(value.value, "gi"), match => `<span class="text-red">${match}</span>`);
}

// 监听组件挂载事件，如果teleport为字符串，则将组件挂载到teleport指定的元素上
const wrapperRef = useTemplateRef<HTMLDivElement>("wrapperRef");
const teleportTarget = shallowRef<HTMLElement | null>(null);
watchEffect(async () => {
  await nextTick();
  if (teleport && wrapperRef.value) {
    teleportTarget.value = typeof teleport === "string" ? document.querySelector(teleport) : teleport;
  }
});

const [collapsed, setCollapsed] = useState(true);
const widthStyle = computed(() => ({
  width: collapsed.value ? "35px" : numberToCss(width),
}));
const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
// 监听组件未处于折叠状态时，输入框获取焦点
whenever(() => !collapsed.value, async () => {
  await nextTick();
  inputRef.value?.focus();
});
// 监听输入框失去焦点事件，如果输入框内容为空且组件未处于折叠状态，则将组件折叠
function handleBlur() {
  if (!value.value && !collapsed.value) {
    setCollapsed(true);
  }
}
// 清除输入框内容
function handleClear() {
  value.value = "";
  inputRef.value?.focus();
}
</script>

<template>
  <!-- <Teleport defer :disabled="!teleportTarget" :to="teleportTarget"> -->
  <div
    ref="wrapperRef"
    :style="widthStyle"
    :class="cn(
      'poi-search rounded-full transition-all duration-500 children:transition-all children:duration-500',
      collapsed ? 'bg-#FF9393/20' : 'bg-black/40',
      $attrs.class || '',
    )"
    @click="setCollapsed(false)">
    <AAutoComplete
      v-model:value="value"
      popup-class-name="poi-search-popup" :style="widthStyle"
      allow-clear :options="options"
      @search="handleSearch" @select="onSelect" @clear="handleClear">
      <div
        :class="cn(
          'w-full flex items-center border bg-#450000/10 rounded-full shadow-[inset_0_0_15px_0px_#FF333333] overflow-hidden h-35px',
          collapsed ? 'border-#E8D1D1/60 text-#E8D1D1/60' : 'border-#C35454 text-#C35454',
        )">
        <span class="inline-flex items-center justify-center text-#E8D1D1/60 leading-none wh-35px">
          <i class="i-ri-search-2-line" />
        </span>
        <input
          ref="inputRef"
          :value="value"
          type="text"
          :class="cn(
            'flex-auto bg-transparent pr-2 placeholder-#535353',
            collapsed && 'hidden',
          )"
          :placeholder="placeholder"
          @blur="handleBlur">
      </div>
      <template #option="{ value: val }">
        <div class="truncate text-white" v-html="highlightText(val)" />
      </template>
    </AAutoComplete>
  </div>
  <!-- </Teleport> -->
</template>

<style scoped lang="scss">
.poi-search {
  :deep(.ant-select) {
    .ant-select-clear {
      background-color: transparent;
      color: #c35454;
    }
  }
}
</style>

<style lang="scss">
.poi-search-popup {
  @apply border border-#C35454 shadow-[inset_0_0_15px_0px_#FF333333];
  background-color: transparent !important;
  background-image:
    linear-gradient(to right, #4500001a 0%, #4500001a 100%), linear-gradient(to right, #00000066 0%, #00000066 100%);
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05),
    inset 0 0 15px 0px #ff333333;

  .ant-select-item.ant-select-item-option-active {
    background-color: rgba(69, 0, 0, 0.5) !important;
  }
}
</style>
