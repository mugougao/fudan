import type { ModalFuncProps } from "ant-design-vue";
import type { MessageInstance } from "ant-design-vue/es/message/interface";
import type { ModalStaticFunctions } from "ant-design-vue/es/modal/confirm";
import type { NotificationInstance } from "ant-design-vue/es/notification/interface";

export {};

declare global {
  interface Window {
    $message: MessageInstance;
    $modal: Omit<ModalStaticFunctions, "warn">;
    $notification: NotificationInstance;
    $confirm: (props: string | Omit<ModalFuncProps, "onOk" | "onCancel">) => Promise<void>;

    __config__: {
      wdp: {
        sceneUrl: string;
        sceneOrder: string;
      };
    };
  }
}
