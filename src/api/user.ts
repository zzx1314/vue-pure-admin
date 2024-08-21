import { http } from "@/utils/http";

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
    roles: Array<string>;
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
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
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
  token: `/api/auth/oauth/token`,
  refreshToken: `/api/auth/oauth/refreshToken`,
  getInfo: `/api/upms/sysUser/info`,
  checkToken: `/api/upms/checkToken/isExpire`,
  updatePassword: `/api/upms/sysUser/edit`
};

/**
 * 检查token
 */
export const checkToken = () => {
  return http.request<Result>("get", urls.checkToken);
};

/** 登录 */
export const getLogin = (data?: object): Promise<UserResult> => {
  const headers = {
    Authorization: "Basic dGhfY2xpZW50OnRo"
  };
  return http.axiosPostFromLogin(urls.token, data, headers);
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    "/api/auth/oauth/refreshToken",
    { data }
  );
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
