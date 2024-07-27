import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
  access_token: string;
  refresh_token: string;
  role: number;
  scope: string;
  token_type: string;
  user_id: number;
  username: string;
  roles?: Array<string>;
  rolesCode?: Array<string>;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return storageSession().getItem(sessionKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  const { access_token, refresh_token } = data;
  function setSessionKey(
    username: string,
    roles: Array<string>,
    rolesCode: Array<string>
  ) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem("token", "Bearer " + access_token);
    storageSession().setItem(sessionKey, {
      access_token,
      refresh_token,
      username,
      roles,
      rolesCode
    });
  }

  if (data.username && data.roles && data.rolesCode) {
    const { username, roles, rolesCode } = data;
    setSessionKey(username, roles, rolesCode);
  } else {
    const username =
      storageSession().getItem<DataInfo>(sessionKey)?.username ?? "";
    const roles = storageSession().getItem<DataInfo>(sessionKey)?.roles ?? [];
    const rolesCode =
      storageSession().getItem<DataInfo>(sessionKey)?.rolesCode ?? [];
    setSessionKey(username, roles, rolesCode);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
