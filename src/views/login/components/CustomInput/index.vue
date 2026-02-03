<script setup lang="ts">
import { Form } from "ant-design-vue";
import { useState } from "@/hooks";

defineOptions({ name: "CustomInput" });

const { name, placeholder = "请输入", addonBefore, addonAfter, password } = defineProps<{
  placeholder?: string;
  addonBefore?: string;
  addonAfter?: string;
  password?: boolean;
  name?: string;
}>();

const formItemContext = Form.useInjectFormItemContext();

const modelValue = defineModel<string>("modelValue", { default: "" });

const [showPassword, setShowPassword] = useState(false);
const inputType = computed(() =>
  password
    ? !showPassword.value ? "password" : "text"
    : "text",
);
</script>

<template>
  <div class="custom-input">
    <span v-if="$slots.addonBefore || addonBefore" class="addon">
      <slot name="addonBefore">{{ addonBefore }}</slot>
    </span>
    <input
      v-model="modelValue" :type="inputType"
      :placeholder="placeholder" autocomplete="off" :name="name"
      @blur="() => formItemContext.onFieldBlur()"
      @change="() => formItemContext.onFieldChange()">
    <span v-if="$slots.addonAfter || addonAfter" class="addon">
      <slot name="addonAfter">{{ addonAfter }}</slot>
    </span>
    <span v-if="password" class="password-icon" @click="() => setShowPassword(!showPassword)">
      <i :class="showPassword ? 'i-ri-eye-off-line' : 'i-ri-eye-line'" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.custom-input {
  @apply h-62px w-full bg-#00000050 border-2 border-#593A3A  text-24px;
  @apply flex items-center;
  @apply text-#7F7F7F;
  input {
    @apply flex-auto overflow-hidden bg-transparent border-none outline-none px-5;
  }
  span.addon {
    @apply pl-5 inline-block min-w-70px;
  }
  .password-icon {
    @apply cursor-pointer pr-3;
    :hover {
      @apply text-white;
    }
  }

  &:has(input:focus) {
    @apply border-#D96666 text-white;
  }
}
</style>
