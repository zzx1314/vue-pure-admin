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

const propertyBusOfficialUrls = {
  page: `/api/property/propertyBusOfficial/page`,
  save: "/api/property/propertyBusOfficial/save",
  delete: `/api/property/propertyBusOfficial/`,
  update: "/api/property/propertyBusOfficial/update"
};

// 办公资产分页
export const propertyBusOfficialPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(propertyBusOfficialUrls.page, query);
};
// 办公资产保存
export const propertyBusOfficialSave = (param?: object) => {
  return http.axiosPostRequest<Result>(propertyBusOfficialUrls.save, param);
};
// 办公资产修改
export const propertyBusOfficialUpdate = (param?: object) => {
  return http.axiosPut<Result>(propertyBusOfficialUrls.update, param);
};
// 办公资产删除
export const propertyBusOfficialDelete = (param?: object) => {
  return http.axiosDelete<Result>(propertyBusOfficialUrls.delete + param);
};
