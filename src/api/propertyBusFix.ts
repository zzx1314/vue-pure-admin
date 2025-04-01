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

const propertyBusFixUrls = {
  page: `/api/property/propertyBusFix/page`,
  save: "/api/property/propertyBusFix/save",
  delete: `/api/property/propertyBusFix/`,
  update: "/api/property/propertyBusFix/update"
};

// 固定资产分页
export const propertyBusFixPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(propertyBusFixUrls.page, query);
};
// 固定资产保存
export const propertyBusFixSave = (param?: object) => {
  return http.axiosPostRequest<Result>(propertyBusFixUrls.save, param);
};
// 固定资产修改
export const propertyBusFixUpdate = (param?: object) => {
  return http.axiosPut<Result>(propertyBusFixUrls.update, param);
};
// 固定资产删除
export const propertyBusFixDelete = (param?: object) => {
  return http.axiosDelete<Result>(propertyBusFixUrls.delete + param);
};
