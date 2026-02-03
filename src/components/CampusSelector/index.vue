<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

defineOptions({ name: "CampusSelector" });
const route = useRoute();
const campusStore = useCampusStore();
const { activeCampusId } = storeToRefs(campusStore);

const items = useTemplateRef<HTMLLIElement[]>("items");
const { tm } = useI18n();

const campusList = computed<{ id: CampusId; title: string }[]>(() => {
  const all = tm("campus");
  if (route.name === "smartTeaching") {
    return all
      .filter(({ id }) => id !== CampusId.Overview)
      .map(({ id, title }) => ({ id, title }));
  }
  return all.map(({ id, title }) => ({ id, title }));
});

const activeItemElement = computed(() => {
  const index = campusList.value.findIndex((item: any) => item.id === activeCampusId.value);
  return items?.value?.[index];
});

const activeItemRectSize = ref({ "--x": "0px", "--y": "0px", "--width": "0px", "--height": "0px" });
function setActiveItemRectSize() {
  if (activeItemElement.value) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeItemElement.value;
    activeItemRectSize.value = {
      "--x": `${offsetLeft}px`,
      "--y": `${offsetTop}px`,
      "--width": `${offsetWidth}px`,
      "--height": `${offsetHeight}px`,
    };
  }
}

watch(
  activeCampusId,
  async () => {
    await nextTick();
    setActiveItemRectSize();
  },
  { flush: "post", immediate: true },
);
useResizeObserver(activeItemElement, setActiveItemRectSize);
</script>

<template>
  <!-- 校区选择器 -->
  <div class="campus-selector relative skew-x-[-30deg] bg-[#7C4D4D]/25">
    <span class="campus-selector-sigment absolute border border-[#CC1A1A] transition-all duration-500 -z-1" :style="activeItemRectSize" />
    <ul
      class="campus-selector-options flex select-none items-center">
      <li
        v-for="({ title, id }, index) in campusList" :key="index"
        ref="items"
        class="campus-item px-18px py-3px text-[14px] font-text-medium transition-colors duration-500 !cursor-pointer hover:!text-white"
        :class="id === activeCampusId ? 'text-white' : 'text-#9E9E9E'"
        @click="() => campusStore.setActiveCampusId(id)">
        <span class="inline-block skew-x-[30deg]">{{ title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.campus-selector {
  .campus-selector-sigment {
    top: var(--y);
    left: var(--x);
    width: var(--width);
    height: var(--height);
    background: linear-gradient(
      179deg,
      rgba(220, 47, 47, 0.24) 2%,
      rgba(198, 35, 35, 0.73) 73%,
      rgba(220, 47, 47, 0) 103%,
      rgba(220, 47, 47, 0) 158%
    );
    &:after,
    &:before {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      background-color: #eabc8b;
      top: 50%;
      transform: skewX(30deg) translateY(-50%) rotate(20deg);
    }
    &:before {
      left: -2px;
    }
    &:after {
      right: -4px;
    }
  }
}
</style>
