import { http } from "@/utils/http";

export type UserResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  role: number;
  scope: string;
  token_type: string;
  user_id: number;
  username: string;
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

const urls = {
  token: `/api/auth/oauth/token`,
  refreshToken: `/api/auth/oauth/refreshToken`,
  getInfo: `/api/upms/sysUser/info`
};

/** 登录 */
export const getLogin = (data?: object) => {
  const headers = {
    Authorization: "Basic dGhfY2xpZW50OnRo"
  };
  return http.axiosPostFrom<UserResult>(urls.token, data, headers);
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    "/api/auth/oauth/refreshToken",
    { data }
  );
};
