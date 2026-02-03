export {};

declare global {
  interface IViteEnv {
    VITE_APP_TITLE: string;
    VITE_HTTP_BASE_URL: string;
    VITE_HTTP_ETL_BASE_URL: string;
    VITE_PORT: number;
    VITE_HTTP_ASSETS_URL: string;
    VITE_CLOUD_MAP_URL: string;
    VITE_THIRD_PARTY_LOGIN_URL: string;
    VITE_THIRD_PARTY_LOGOUT_URL: string;

  }

  interface ImportMetaEnv extends IViteEnv {
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
