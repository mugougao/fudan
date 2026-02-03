<script lang="tsx">
import {
  ConfigProvider,
  legacyLogicalPropertiesTransformer,
  message,
  Modal,
  type ModalFuncProps,
  notification,
  StyleProvider,
} from "ant-design-vue";
import en from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { defineComponent } from "vue";
import { useI18nStore } from "@/stores/i18n.ts";

export default defineComponent({
  name: "AntdConfig",
  setup(props, { slots }) {
    message.config({
      // top: `100px`,
      duration: 2,
      maxCount: 3,
      rtl: true,
      // prefixCls: 'my-message'
    });
    const i18nStore = useI18nStore();
    const locale = computed(() => i18nStore.lang === "zhCN" ? zhCN : en);

    function confirm(props: string | Omit<ModalFuncProps, "onOk" | "onCancel">): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          const options = typeof props === "string" ? { content: props } : props;
          Modal.confirm({ title: "操作提示", ...options, onOk: () => resolve(), onCancel: () => reject(new Error("取消")) });
        }
        catch (e) {
          reject(e);
        }
      });
    }
    Object.entries({ message, modal: Modal, notification, confirm })
      .forEach(([key, value]) => {
        // window[`$${key}`] = value;
        Object.defineProperty(window, `$${key}`, { value, writable: false, enumerable: true });
      });

    return () => (
      <StyleProvider hash-priority="high" transformers={[legacyLogicalPropertiesTransformer]}>
        <ConfigProvider locale={locale.value}>
          {slots.default?.()}
        </ConfigProvider>
      </StyleProvider>
    );
  },
});
</script>
