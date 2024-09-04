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
  page: `/api/ota/otaBusCer/page`,
  save: "/api/ota/otaBusCer/save",
  delete: `/api/ota/otaBusCer/`,
  update: "/api/ota/otaBusCer/update"
};

// otaCa分页
export const devPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(otaDevUrls.page, query);
};
// OTACa保存
export const devSave = (param?: object) => {
  return http.axiosPostRequest<Result>(otaDevUrls.save, param);
};
// OTACa修改
export const devUpdate = (param?: object) => {
  return http.axiosPut<Result>(otaDevUrls.update, param);
};
// OTACa删除
export const devDelete = (param?: object) => {
  return http.axiosDelete<Result>(otaDevUrls.delete + param);
};
