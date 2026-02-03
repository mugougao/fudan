<script setup lang="ts">
defineOptions({ name: "CustomLink" });

const {
  isLink,
  link,
  routeName,
  disabled,
} = defineProps<IProps>();

interface IProps {
  isLink?: boolean;
  link?: string;
  routeName?: string;
  disabled?: boolean;
}
</script>

<template>
  <a v-if="disabled" href="javascript:;" :class="$attrs.class"><slot /></a>
  <RouterLink
    v-else-if="routeName"
    v-slot="{ navigate, href }" :to="{ name: routeName }" custom>
    <a :href="href" :class="$attrs.class" @click="navigate">
      <slot />
    </a>
  </RouterLink>
  <a v-else-if="isLink" :href="link" target="_blank" :class="$attrs.class"><slot /></a>
  <a v-else href="javascript:;" :class="$attrs.class"><slot /></a>
</template>

<style scoped>

</style>
