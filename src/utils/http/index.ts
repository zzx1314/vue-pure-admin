import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer
} from "axios";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import qs from "qs";
import { stringify } from "qs";
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import type { UserResult } from "@/api/user";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 100000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

export const cleanQuery = (query: Record<string, any>): Record<string, any> => {
  if (!query) return {};
  return Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** `token`过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新`token` */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
        const whiteList = ["/refreshToken", "/login"];
        return whiteList.some(url => config.url.endsWith(url))
          ? config
          : new Promise(resolve => {
              const data = getToken();
              if (data) {
                // 在请求头添加权限
                config.headers["Authorization"] = formatToken(data.accessToken);
                resolve(config);
              } else {
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        console.log("拦截异常：", error.response);
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        useUserStoreHook().logOut();
        message("登录超时，请重新登录", { type: "error" });
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }

  /**
   * post请求,from表单
   * @param url url
   * @param params 参数
   */
  public axiosPost<T>(url, params): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, qs.stringify(params), {
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * from 请求直接返回response
   * @param url
   * @param params
   */
  public axiosPostFrom<T>(url: string, params: any, heads?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, qs.stringify(params), {
          headers: {
            ...(heads || {}),
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  public axiosPostFromLogin(
    url: string,
    params: any,
    heads?: any
  ): Promise<UserResult> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, qs.stringify(params), {
          headers: {
            ...(heads || {}),
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then((response: any) => {
          const result = {
            success: true,
            data: {
              avatar: "", // 需要填充实际值
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              expires: response.expires,
              username: response.username, // 需要填充实际值
              nickname: response.username, // 需要填充实际值
              roles: response.roles
            }
          };
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * post请求
   * @param url
   * @param params
   */
  public axiosPostRequest<T>(url, params?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, params, {
          headers: {
            "content-type": "application/json"
          }
        })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * get请求
   * @param url url
   * @param params 参数
   */
  public axiosGet<T>(url, params?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .get(url, { params })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public axiosGetDown<T>(url, range): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .get(url, {
          responseType: "blob",
          headers: {
            Authentication: sessionStorage.getItem("token"),
            Range: range
          }
        })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * get请求
   * @param url
   * @param params
   */
  public axiosGetRequest<T>(url, params): Promise<T> {
    const cleanedQuery = cleanQuery(params);
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .get(url + "?" + qs.stringify(cleanedQuery), {})
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * delete 请求
   * @param url
   * @param params
   */

  public axiosDelete<T>(url, params?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .delete(url, params)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * put请求
   * @param url
   * @param params
   */
  public axiosPut<T>(url, params): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .put(url, params)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * put请求添加config
   * @param url
   * @param params
   * @param config
   */
  public axiosPutRequest<T>(url, params, config): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .put(url, params, config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public axiosPatch(url, params) {
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .patch(url, params)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  public axiosGetAll(url, config) {
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .get(url, config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   *
   * @param URL 下载地址
   * @param mode 下载方式 get post
   * @param name 下载文件名
   * @param param 参数
   */
  public downloadUrlMode(url, mode, name, param) {
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance({
        url: url,
        method: mode,
        data: param,
        params: param,
        headers: {
          Authentication: sessionStorage.getItem("token"),
          Accept: "application/json"
        },
        responseType: "arraybuffer"
      })
        .then((response: undefined) => {
          // name 截取后缀，以点
          const fileType = name.substring(name.lastIndexOf(".") + 1);
          const blob = new Blob([response], {
            type: "application/" + fileType
          });
          resolve(response);
          const fileName = name;
          // const fileName = name;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          window.setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          }, 0);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 文件预览
   * @param url
   * @param type
   */
  public previewFile(url, type) {
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance({
        url: url,
        method: "GET",
        headers: {
          Authentication: sessionStorage.getItem("token"),
          Accept: "application/json"
        },
        responseType: type
      })
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 下载
   * @param URL
   */
  public downloadUrl(URL) {
    PureHttp.axiosInstance({
      method: "get",
      url: URL,
      headers: {
        Authentication: sessionStorage.getItem("token"),
        Accept: "application/json"
      },
      responseType: "blob"
    }).then((response: undefined) => {
      const blob = new Blob([response], { type: "application/zip" });
      const downloadElement = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      downloadElement.href = url;
      downloadElement.download = name + ".zip";
      downloadElement.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /**
   * 上传文件
   * @param URL
   * @param formData
   */
  public uploadFile(URL, formData) {
    const url = URL;
    const headers = {
      Authentication: sessionStorage.getItem("token"),
      "Content-Type": "multipart/form-data"
    };
    return PureHttp.axiosInstance.post(url, formData, { headers: headers });
  }

  /**
   * 获取数据流
   * @param url
   */
  public getBufferFile(url) {
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance({
        url,
        method: "get",
        headers: {
          Authentication: sessionStorage.getItem("token"),
          Accept: "application/json"
        },
        responseType: "arraybuffer"
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 上传文件
   * @param URL
   * @param formData
   */
  public upFile(URL, formData) {
    const url = URL;
    const headers = { "Content-Type": "multipart/form-data" };
    const promise = new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, formData, { headers: headers })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 将二进制文件转化成base64
   * @param data
   */
  public getImageBase64(data) {
    const blob = new Blob([data], { type: "image/jpg" }); //类型一定要写！！！
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}

export const http = new PureHttp();
