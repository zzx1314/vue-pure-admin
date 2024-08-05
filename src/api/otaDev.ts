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

const otaDevUrls = {
  page: `/api/ota/otaBusDev/page`,
  save: "/api/ota/otaBusDev/save",
  delete: `/api/ota/otaBusDev`,
  update: "/api/ota/otaBusDev/update"
};

// 设备分页
export const devPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(otaDevUrls.page, query);
};
// 设备保存，设备注册
export const devSave = (param?: object) => {
  return http.axiosPostRequest<Result>(otaDevUrls.save, param);
};
// 设备修改
export const devUpdate = (param?: object) => {
  return http.axiosPut<Result>(otaDevUrls.update, param);
};
// 设备删除
export const devDelete = (param?: object) => {
  return http.axiosDelete<Result>(otaDevUrls.delete, param);
};
