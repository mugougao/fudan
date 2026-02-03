<script setup lang="ts">
import TabNavExtraItem from "../TabNavExtraItem/index.vue";

defineOptions({ name: "TabNavExtra" });

const { options = [] } = defineProps<{
  options: { label: string;value: string | number }[];
}>();

const modelValue = defineModel< string | number >("modelValue", { default: "" });
</script>

<template>
  <div class="tab-nav-extra inline-block">
    <div class="tab-nav-extra-content mx-2 flex items-center gap-2">
      <TabNavExtraItem
        v-for="({ label, value }) in options" :key="value"
        :model-value="value === modelValue"
        :disabled-update="true"
        @click="modelValue = value">
        {{ label }}
      </TabNavExtraItem>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
