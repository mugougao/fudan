import { request } from "@/utils/request";

export interface userItem {
  id: string;
  username: string;
  password: null;
  jobNumber: string;
  department: string;
  section: string;
  state: string;
}

export function list(username = "", pageNum = 1, pageSize = 10) {
  return request.post<ApiResponsePageInfoType<userItem>>(
    "/user/getListUser",
    { username, pageNum, pageSize },
    { custom: { loading: false } },
  );
}

export function add(data: Partial<userItem>) {
  return request.post<ApiResponseDataType<userItem>>(
    "/user/InstallUser",
    data,
    { custom: { loading: false } },
  );
}

export function update(data: Partial<userItem>) {
  return request.post<ApiResponseDataType<userItem>>(
    "/user/UpdateUser",
    data,
    { custom: { loading: false } },
  );
}

export function del(id: string) {
  return request.post<ApiResponseDataType<userItem>>(
    "/user/delUser",
    { id },
    { custom: { loading: false } },
  );
}

// 获取用户拥有的权限
export function getUserPermissions(id: string) {
  return request.post<ApiResponseDataType<{
    parent?: number;
    sort_type: number;
    name: string;
    route_url: string;
    id: number;
  }[]>>(
    "/user/listPermissionByUserId",
    { id },
    { custom: { loading: false } },
  );
}

export interface IGetPermissionResult {
  parent?: number;
  sort_type: number;
  name: string;
  route_url: string;
  id: number;
  isexist: 0 | 1;
}

// 获取用户权限
export function getPermissions(id: string) {
  return request.post<ApiResponseDataType<IGetPermissionResult[]>>(
    "/user/getUserIdByPermission",
    { id },
    { custom: { loading: false } },
  );
}

// 修改用户权限
export function updateUserPermissions(userId: string, permissionIds: number[]) {
  return request.post<ApiResponseDataType<string[]>>(
    "/user/UpdateUserByPermission",
    {
      userId,
      listPermission: permissionIds,
    },
    { custom: { loading: false } },
  );
}
