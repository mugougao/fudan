<script setup lang="ts">
defineOptions({ name: "NavigationMenu", inheritAttrs: false });

const activeTab = defineModel<string>("activeTab");

const tabList = [
  { value: "0", name: "宣传片", label: "viewFuDan.promotionalVideo" },
  { value: "1", name: "经典打卡", label: "viewFuDan.classicPunchIn" },
  { value: "3", name: "拥抱自然", label: "viewFuDan.embraceNature" },
  { value: "2", name: "Study Tour", label: "viewFuDan.studyTour" },
];
</script>

<template>
  <ul class="navigation-menu absolute left-5 top-1/2 py-[40px] -translate-y-1/2 space-y-[40px]">
    <li
      v-for="item in tabList" :key="item.value"
      class="navigation-menu-item ml-1.5 flex items-center gap-1"
      :class="activeTab === item.value && 'active'"
      @click="activeTab = item.value">
      <span class="block size-[10px] border-2 border-white rounded-full bg-[#CC1A1A]" />
      <span>
        <img src="@/assets/images_new/arrow-2.png" alt="arrow">
      </span>
      <span class="navigation-menu-item-content flex items-center pl-4 text-[16px] font-title">
        {{ $t(item.label) }}
      </span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.navigation-menu {
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 100%;
    color: transparent;
    background: radial-gradient(#fff 0%, #fff 2px, transparent 2px);
    background-size: 20px 20px;
    background-color: rgba(#cc1a1a, 0.4);
    mask: linear-gradient(to bottom, transparent -20%, #000 50%, transparent 120%);
    z-index: 1;
  }

  .navigation-menu-item {
    position: relative;
    z-index: 3;
    .navigation-menu-item-content {
      min-width: 121px;
      height: 36px;
      background-image: url("@/assets/images_new/btn-bg.png");
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 121px 36px;
    }

    &.active {
      .navigation-menu-item-content {
        background-image: url("@/assets/images_new/btn-bg-active.png");
      }
    }
  }
}
</style>
