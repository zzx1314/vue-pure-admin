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

const oBusDeviceUrls = {
  page: `/api/o/oBusDevice/page`,
  save: "/api/o/oBusDevice/save",
  delete: `/api/o/oBusDevice/`,
  update: "/api/o/oBusDevice/update"
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
