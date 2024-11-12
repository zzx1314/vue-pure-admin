import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data?: Array<any>;
};

type ResultPage = {
  code: number;
  msg: string;
  data?: {
    records: Array<any>;
    total: number;
  };
};

const collectorBusDevUrls = {
  page: `/api/collector/collectorBusDev/page`,
  save: "/api/collector/collectorBusDev/save",
  delete: `/api/collector/collectorBusDev/`,
  update: "/api/collector/collectorBusDev/update",
  senUpdate: "/api/collector/collectorBusSensor/update",
  senDelete: "/api/collector/collectorBusSensor/"
};

// 采集器设备信息分页
export const collectorBusDevPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(collectorBusDevUrls.page, query);
};
// 采集器设备信息保存
export const collectorBusDevSave = (param?: object) => {
  return http.axiosPostRequest<Result>(collectorBusDevUrls.save, param);
};
// 采集器设备信息修改
export const collectorBusDevUpdate = (param?: object) => {
  return http.axiosPut<Result>(collectorBusDevUrls.update, param);
};
// 采集器设备信息删除
export const collectorBusDevDelete = (param?: object) => {
  return http.axiosDelete<Result>(collectorBusDevUrls.delete + param);
};
// 采集器设备传感器信息修改
export const collectorBusSensorUpdate = (param?: object) => {
  return http.axiosPut<Result>(collectorBusDevUrls.senUpdate, param);
};
// 采集器设备传感器信息删除
export const collectorBusSensorDelete = (param?: object) => {
  return http.axiosDelete<Result>(collectorBusDevUrls.senDelete + param);
};
