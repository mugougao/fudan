<script setup lang="tsx">
defineOptions({ name: "ChargingPilesList", inheritAttrs: false });

const { data } = defineProps<{
  data: [
    { id: string; name: string }[],
    { id: string; name: string }[],
    { id: string; name: string }[],
    { id: string; name: string }[],
  ];
}>();

const hasScroll = computed(() => data.flat().length > 20);
const isEmpty = computed(() => data.flat().length === 0);

const selectId = defineModel<string | undefined>("selectId", { default: undefined });
function setSelectedKey(key: string | undefined) {
  if (selectId.value === key) {
    setSelectedKey(undefined);
    return;
  }
  selectId.value = key;
}

function ChargingPilesListItem(props: { type: "left" | "right"; options: { name: string; id: string }[] }) {
  return (
    <ul class={`charging-piles-list-item inline-block float-left ${props.type}`}>
      {
        props.options.map(({ name, id }) => (
          <li
            class={`charging-piles-list-item-leaf cursor-pointer ${id === selectId.value ? "selected" : ""}`}
            onClick={() => setSelectedKey(id)}
          >
            <span>{name}</span>
          </li>
        ))
      }
    </ul>
  );
}

const hasUp = useTemplateRef<HTMLSpanElement>("hasUp");
const hasDown = useTemplateRef<HTMLSpanElement>("hasDown");
const hasUpIsVisible = useElementVisibility(hasUp);
const hasDownIsVisible = useElementVisibility(hasDown);

const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");
function handleScroll(type: "up" | "down") {
  if (!scrollContainer.value) return;
  const scrollTop = scrollContainer.value.scrollTop || 0;
  // 平滑滚动
  scrollContainer.value.scrollTo({
    top: scrollTop + (type === "up" ? -120 : 120),
    behavior: "smooth",
  });
}

function getTypeByIndex(index: number): "left" | "right" {
  if (index % 2 === 0) {
    return "left";
  }
  return "right";
}
</script>

<template>
  <div class="charging-piles-list relative my-2">
    <template v-if="isEmpty">
      <div class="flex items-center justify-center">
        <AEmpty description="暂无数据" />
      </div>
    </template>
    <template v-else>
      <div
        ref="scrollContainer"
        class="relative max-h-[200px] px-3 px-5 scrollbar-hide [&>ul:nth-of-type(3)]:!ml-[40px]"
        :class="hasScroll ? 'overflow-y-auto' : 'overflow-y-hidden'">
        <span ref="hasUp" class="has-up clear-both mt-[1px] block h-[1px] w-full" />
        <ChargingPilesListItem v-for="(arr, index) in data" :key="index" :type="getTypeByIndex(index)" :options="arr" />
        <span ref="hasDown" class="has-down clear-both mt-[-1px] block h-[1px] w-full" />
      </div>
      <template v-if="hasScroll">
        <button
          class="absolute left-1/2 top-[-8px] bg-transparent text-xl text-white -translate-x-1/2 disabled:cursor-not-allowed disabled:text-gray-500 hover:text-[#cc1a1a]"
          :disabled="hasUpIsVisible"
          @click="handleScroll('up')">
          <i class="i-ri-arrow-up-double-line" />
        </button>
        <button
          class="absolute bottom-[-8px] left-1/2 bg-transparent text-xl text-white -translate-x-1/2 disabled:cursor-not-allowed disabled:text-gray-500 hover:text-[#cc1a1a]"
          :disabled="hasDownIsVisible"
          @click="handleScroll('down')">
          <i class="i-ri-arrow-down-double-line" />
        </button>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.charging-piles-list {
  :deep(.charging-piles-list-item) {
    padding: 5px 0;

    &:nth-child(3) {
      margin-left: 10px;
      margin-right: 10px;
    }
    &:nth-child(4) {
      margin-right: 10px;
      margin-left: 10px;
    }

    .charging-piles-list-item-leaf {
      width: 60px;
      height: 30px;
      line-height: 30px;
      color: rgba(#ffffff, 0.6);
      font-size: 12px;
      white-space: nowrap;
      position: relative;

      &.selected {
        color: #fff;
      }

      &:not(:last-child) {
        margin-bottom: 10px;
      }
      &:before,
      &:after {
        content: "";
        position: absolute;
      }
      &:before {
        width: 20px;
        height: 1px;
        background: linear-gradient(to right, transparent, #fff, transparent) no-repeat;
        top: 14px;
      }

      &:after {
        width: 4px;
        height: 4px;
        background: white;
        top: 12px;
        transform: rotate(45deg);
      }
    }

    &.left {
      background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat right top / 2px 100%;
      padding-right: 20px;
      .charging-piles-list-item-leaf {
        border-right: 3px solid #e7c0c0;
        background:
          linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left top /
            100% 1px,
          linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left
            bottom / 100% 1px,
          linear-gradient(to right, rgba(#7c4d4d, 0), rgba(#7c4d4d, 0.6));
        text-align: right;
        padding-right: 5px;
        &:before {
          right: -20px;
        }
        &:after {
          right: -23px;
        }

        &.selected {
          background:
            linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left
              top / 100% 1px,
            linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left
              bottom / 100% 1px,
            linear-gradient(to right, rgba(#7c4d4d, 0), rgba(#cc1a1a, 1));
        }
      }
    }
    &.right {
      background: linear-gradient(to bottom, transparent, #fff, transparent) no-repeat left top / 2px 100%;
      padding-left: 20px;
      .charging-piles-list-item-leaf {
        border-left: 3px solid #e7c0c0;
        background:
          linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 80%, rgba(#e7c0c0, 0.3)) no-repeat left top /
            100% 1px,
          linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 80%, rgba(#e7c0c0, 0.3)) no-repeat left
            bottom / 100% 1px,
          linear-gradient(to left, rgba(#7c4d4d, 0), rgba(#7c4d4d, 0.6));
        text-align: left;
        padding-left: 5px;
        &:before {
          left: -20px;
        }
        &:after {
          left: -23px;
        }
        &.selected {
          background:
            linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left top /
              100% 1px,
            linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(#e7c0c0, 1) 70%, rgba(#e7c0c0, 0.3)) no-repeat left
              bottom / 100% 1px,
            linear-gradient(to left, rgba(#7c4d4d, 0), rgba(#cc1a1a, 1));
        }
      }
    }
  }
}
</style>
