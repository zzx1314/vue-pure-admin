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

const cerBusUrls = {
  page: `/api/cer/cerBusProd/page`,
  save: "/api/cer/cerBusProd/save",
  delete: `/api/cer/cerBusProd/`,
  update: "/api/cer/cerBusProd/update",
  getFeatureSelect: "/api/cer/cerBusProd/getFeaturesSelect"
};

// 产品管理分页
export const prodPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(cerBusUrls.page, query);
};
// 产品管理保存
export const prodSave = (param?: object) => {
  return http.axiosPostRequest<Result>(cerBusUrls.save, param);
};
// 产品管理修改
export const prodUpdate = (param?: object) => {
  return http.axiosPut<Result>(cerBusUrls.update, param);
};
// 产品管理删除
export const prodDelete = (param?: object) => {
  return http.axiosDelete<Result>(cerBusUrls.delete + param);
};

// 获取所有产品
export const getFeatureSelect = (query?: object) => {
  return http.axiosGetRequest<Result>(cerBusUrls.getFeatureSelect, query);
};
