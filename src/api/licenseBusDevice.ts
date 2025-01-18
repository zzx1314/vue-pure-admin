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

const licenseBusDeviceUrls = {
  page: `/api/license/licenseBusDevice/page`,
  save: "/api/license/licenseBusDevice/save",
  delete: `/api/license/licenseBusDevice/`,
  update: "/api/license/licenseBusDevice/update"
};

// 授权设备分页
export const licenseBusDevicePage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(licenseBusDeviceUrls.page, query);
};
// 授权设备保存
export const licenseBusDeviceSave = (param?: object) => {
  return http.axiosPostRequest<Result>(licenseBusDeviceUrls.save, param);
};
// 授权设备修改
export const licenseBusDeviceUpdate = (param?: object) => {
  return http.axiosPut<Result>(licenseBusDeviceUrls.update, param);
};
// 授权设备删除
export const licenseBusDeviceDelete = (param?: object) => {
  return http.axiosDelete<Result>(licenseBusDeviceUrls.delete + param);
};
