import { request } from "@/utils/request";

export interface IFetchLoginParams {
  username: string;
  password: string;
}

export interface IFetchLoginResult {
  loginUserInfo: {
    id: string;
    username: string;
    password: string;
    jobNumber: string;
    department: string;
    section: string;
    state: string;
  };
  token: string;
}

/**
 *  登录
 * @param params
 */
export function fetchLogin(params: IFetchLoginParams) {
  return request.post<ApiResponseDataType<IFetchLoginResult>>("/in/login", params, { custom: { loading: false } });
}

// 第三方登录与本地登录 同步
export function fetchThirdPartyLogin(ticket: string) {
  return request.post<ApiResponseDataType<any>>("/login", { ticket }, { custom: { loading: false } });
}

// 验证登录是否过期
export function fetchLoginIsExpired() {
  return request.get<ApiResponseDataType<boolean>>("/loginTest");
}
