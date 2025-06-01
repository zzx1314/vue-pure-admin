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

const propertyPersonUrls = {
  page: `/api/property/propertyBusPerson/page`,
  save: "/api/property/propertyBusPerson/save",
  delete: `/api/property/propertyBusPerson/`,
  update: "/api/property/propertyBusPerson/update"
};

// 个人资产分页
export const propertyPersonPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(propertyPersonUrls.page, query);
};
// 个人资产保存
export const propertyPersonSave = (param?: object) => {
  return http.axiosPostRequest<Result>(propertyPersonUrls.save, param);
};
// 个人资产修改
export const propertyPersonUpdate = (param?: object) => {
  return http.axiosPut<Result>(propertyPersonUrls.update, param);
};
// 个人资产删除
export const propertyPersonDelete = (param?: object) => {
  return http.axiosDelete<Result>(propertyPersonUrls.delete + param);
};
