<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import type { IFetchLoginParams } from "@/api/login.ts";
import { useState } from "@/hooks";
import { useUserStore } from "@/stores/user.ts";
import { cn } from "@/utils";
import CustomInput from "../CustomInput/index.vue";

defineOptions({ name: "LocalLogin" });

const emits = defineEmits<{
  changeLoginType: [loginType: "thirdParty"];
}>();

const router = useRouter();
const userStore = useUserStore();

const formData = reactive<IFetchLoginParams>({ username: "", password: "" });

const formRules: IFormRules<IFetchLoginParams> = {
  username: [
    { required: true, message: "请输入用户名" },
  ],
  password: [
    { required: true, message: "请输入密码" },
  ],
};
const formRef = useTemplateRef<FormInstance>("formRef");
const [isLogging, setIsLogging] = useState(false);
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    const { username, password } = formData;
    setIsLogging(true);
    await userStore.loginAction(username, password);
    window.$message.success("登录成功");
    await router.push("/");
  }
  catch (error) {
    window.$message.error("登录失败");
  }
  finally {
    setIsLogging(false);
  }
}
</script>

<template>
  <div class="local-login">
    <AForm ref="formRef" :model="formData" :rules="formRules" @submit.prevent.stop>
      <AFormItem name="username">
        <CustomInput v-model="formData.username" addon-before="ID:" placeholder="请输入账号" />
      </AFormItem>
      <AFormItem name="password">
        <CustomInput v-model="formData.password" password addon-before="PW:" placeholder="请输入密码" />
      </AFormItem>
      <AFormItem>
        <button
          type="button"
          :class="cn(
            'submit-button h-55px w-487px  text-[26px] font-text-medium mb-5',
            'flex items-center justify-center gap-5',
            isLogging ? 'text-gray-300' : 'text-white hover:text-red-200',
          )"
          :disabled="isLogging"
          @click="handleSubmit">
          <i v-if="isLogging" class="i-ri-loader-4-line animate-spin text-22px" />
          <span>登录</span>
        </button>
        <button
          type="button" class="bg-transparent text-22px text-#FFD779 font-text-medium hover:text-#FFD779/80"
          @click="emits('changeLoginType', 'thirdParty')">
          统一认证身份登录
        </button>
      </AFormItem>
    </AForm>
  </div>
</template>

<style scoped lang="scss">
.local-login {
  :deep(.ant-form) {
    @apply w-487px mx-auto;
    .submit-button {
      background-image: url("@/assets/images/login/login-btn.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .ant-form-item {
      @apply mb-10;
    }
  }
}
</style>
