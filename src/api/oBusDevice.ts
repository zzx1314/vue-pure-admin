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
  reportLog: "/api/operation/command/reportLog/",
  getHardWareInfo: "/api/operation/oBusDevice/getHardWareInfo/",
  getSysStatus: "/api/operation/oBusDevice/getSysStatus/",
  getLineChart: "/api/operation/oBusDeviceHistoryHeartbeat/getLineChart/"
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
export const oBusReportLog = (deviceId?: string, param?: object) => {
  return http.axiosPostRequest<Result>(
    oBusDeviceUrls.reportLog + deviceId,
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

export const getSysStatus = (deviceId?: string, param?: object) => {
  return http.axiosGetRequest<Result>(
    oBusDeviceUrls.getSysStatus + deviceId,
    param
  );
};
