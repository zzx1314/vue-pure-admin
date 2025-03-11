import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data?: any;
};

type ResultPage = {
  code: number;
  msg: string;
  data?: {
    records: Array<any>;
    total: number;
  };
};

const oBusDeviceUrls = {
  page: `/api/operation/oBusDevice/page`,
  save: "/api/operation/oBusDevice/save",
  delete: `/api/operation/oBusDevice/`,
  update: "/api/operation/oBusDevice/update",
  pushCommand: "/api/operation/command/pushCommand/",
  getHardWareInfo: "/api/operation/oBusDevice/getHardWareInfo/",
  getSysStatus: "/api/operation/oBusDevice/getSysStatus/",
  getHistoryOnOrOffine: "/api/operation/oBusDeviceOnOrOffine/getHistory/",
  checkShellLogin: "/api/operation/oBusDevice/checkShellLogin/"
};

// 设备信息分页
export const oBusDevicePage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(oBusDeviceUrls.page, query);
};
// 设备信息保存
export const oBusDeviceSave = (param?: object) => {
  return http.axiosPostRequest<Result>(oBusDeviceUrls.save, param);
};
// 设备信息修改
export const oBusDeviceUpdate = (param?: object) => {
  return http.axiosPut<Result>(oBusDeviceUrls.update, param);
};
// 设备信息删除
export const oBusDeviceDelete = (param?: object) => {
  return http.axiosDelete<Result>(oBusDeviceUrls.delete + param);
};
// 设备上报日志
export const oBusPushCommand = (deviceId?: string, param?: object) => {
  return http.axiosPostRequest<Result>(
    oBusDeviceUrls.pushCommand + deviceId,
    param
  );
};
// 设备硬件信息
export const getHardWareInfo = (deviceId?: string, param?: object) => {
  return http.axiosGetRequest<Result>(
    oBusDeviceUrls.getHardWareInfo + deviceId,
    param
  );
};
// 获取系统状态
export const getSysStatus = (deviceId?: string, param?: object) => {
  return http.axiosGetRequest<Result>(
    oBusDeviceUrls.getSysStatus + deviceId,
    param
  );
};
// 获取离线在线状态
export const getHistoryOnOrOffine = (deviceId?: string, param?: object) => {
  return http.axiosGetRequest<Result>(
    oBusDeviceUrls.getHistoryOnOrOffine + deviceId,
    param
  );
};

// 获取设备是否登录
export const checkShellLogin = (deviceId?: string, param?: object) => {
  return http.axiosGetRequest<Result>(
    oBusDeviceUrls.checkShellLogin + deviceId,
    param
  );
};
