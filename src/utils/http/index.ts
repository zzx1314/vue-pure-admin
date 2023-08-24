import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import qs from "qs";
import { stringify } from "qs";
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
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

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
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
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ["/refreshToken", "/login"];
        return whiteList.some(v => config.url.indexOf(v) > -1)
          ? config
          : new Promise(resolve => {
              const data = getToken();
              if (data) {
                // 在请求头添加权限
                config.headers["Authorization"] = formatToken(
                  data.access_token
                );
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
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
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

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
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
        .then(response => {
          resolve(response.data);
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
  public axiosPostFrom(url, params): Promise<any> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, qs.stringify(params), {
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(response => {
          resolve(response);
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
  public axiosPostRequest<T>(url, params): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .post(url, params, {
          headers: {
            "content-type": "application/json"
          }
        })
        .then(response => {
          resolve(response.data);
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
  public axiosGet<T>(url, params): Promise<T> {
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

  /**
   * get请求
   * @param url
   * @param params
   */
  public axiosGetRequest<T>(url, params): Promise<T> {
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .get(url + "?" + qs.stringify(params), {})
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
        .then(response => {
          resolve(response.data);
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
        .then(response => {
          resolve(response.data);
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
        .then(response => {
          resolve(response.data);
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
        .then(response => {
          resolve(response.data);
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
        .then(response => {
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
   * @param fileType 下载文件格式
   */
  public downloadUrlMode(url, mode, name, param, fileType) {
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
        .then(response => {
          const blob = new Blob([response.data], {
            type: "application/" + fileType
          });
          resolve(response.data);
          const fileName = name + "." + fileType;
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
    }).then(response => {
      const blob = new Blob([response.data], { type: "application/zip" });
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
    const headers = { "Content-Type": "multipart/form-data" };
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
}

export const http = new PureHttp();
