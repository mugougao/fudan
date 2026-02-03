<script setup lang="ts">
import { useOverview } from "@/composables/financial/useOverview";
import useWatchCampusIdPushRoute from "@/composables/useWatchCampusIdPushRoute.ts";
import Asset from "./components/Asset/index.vue";
import Electric from "./components/Electric/index.vue";
import FinancialCategoriesCount from "./components/FinancialCategoriesCount/index.vue";
import Property from "./components/Property/index.vue";
import Repair from "./components/Repair/index.vue";
import WaterUse from "./components/WaterUse/index.vue";

useWatchCampusIdPushRoute({
  overviewRouteName: "financial.index",
  campusRouteName: "financial.campus",
});

const categories = ref<string | undefined>(undefined);

const categoriesComponents = {
  asset: Asset,
  electric: Electric,
  waterUse: WaterUse,
  property: Property,
  repair: Repair,
};

const { overviewState, categoriesComponentProps } = useOverview(categories);
</script>

<template>
  <UiViewPanelRightLarge :show-return="Boolean(categories)" @custom-return="categories = undefined">
    <template #left>
      <UiBoxPanel title-path="financial.index.schoolOverview" class="row-span-14">
        <FinancialCategoriesCount v-model="categories" :data="overviewState" />
      </UiBoxPanel>
    </template>
    <template v-if="categories" #right>
      <TransitionFadeInRight :appear="false" mode="out-in">
        <component v-bind="categoriesComponentProps" :is="categoriesComponents[categories]" :key="categories" />
      </TransitionFadeInRight>
    </template>
  </UiViewPanelRightLarge>
</template>

<style scoped lang="scss">

</style>
