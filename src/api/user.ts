import { http } from "@/utils/http";
import {getToken} from "@/utils/auth";
const FORM_CONTENT_TYPE = "application/x-www-form-urlencoded";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<number>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
    // 用户id
    user_id?: Number;
  };
};

export type RefreshTokenResult = {
  /** `token` */
  access_token: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refresh_token: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires_in: string;
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

const urls = {
  token: `/api/upms/oauth2/token`,
  logout: `/api/upms/token/logout`,
  getInfo: `/api/upms/sysUser/info`,
  checkToken: `/api/upms/token/check_token`,
  updatePassword: `/api/upms/sysUser/edit`,
  getUserByRoleIdNoPage: `/api/upms/sysUser/getUserByRoleIdNoPage`
};

/**
 * 检查token
 */
export const checkToken = () => {
  const token = getToken();
  const basicAuth =
    "Basic " + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
  const param = {
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      "Content-Type": FORM_CONTENT_TYPE
    },
    params: {
      token: token.accessToken
    }
  };
  return http.request<Result>("get", urls.checkToken, param);
};

/** 登录 */
export const getLogin = (data?: object): Promise<UserResult> => {
  const basicAuth =
    "Basic " + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
  const headers = {
    Authorization: basicAuth
  };
  return http.axiosPostFromLogin(urls.token, data, headers);
};

export const userLogout = (): Promise<UserResult> => {
  return http.axiosDelete(urls.logout);
};

/** 刷新`token` */
export const refreshTokenApi = (refresh_token?: object) => {
  const basicAuth =
    "Basic " + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
  const grant_type = "refresh_token";
  const scope = "server";
  const dataParam = {
    headers: {
      skipToken: true,
      Authorization: basicAuth,
      "Content-Type": FORM_CONTENT_TYPE
    },
    data: { refresh_token, grant_type, scope }
  };
  return http.request<RefreshTokenResult>("post", urls.token, dataParam);
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};

/** 账户设置-修改密码 */
export const updatePassword = (data?: object) => {
  return http.axiosPut<Result>(urls.updatePassword, data);
};

/** 获取用户列表 */
export const getUserByRoleIdNoPage = (query?: object) => {
  return http.axiosGetRequest<Result>(urls.getUserByRoleIdNoPage, query);
};
