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

const otaBusResourceUrls = {
  page: `/api/ota/otaBusResource/page`,
  save: "/api/ota/otaBusResource/save",
  delete: `/api/ota/otaBusResource/`,
  update: "/api/ota/otaBusResource/update",
  push: "/api/ota/otaBusResource/push"
};

export const cleanQuery = (query: Record<string, any>): Record<string, any> => {
  if (!query) return {};
  return Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );
};

// 资源分页
export const resPage = (query?: object) => {
  const cleanedQuery = cleanQuery(query);
  return http.axiosGetRequest<ResultPage>(
    otaBusResourceUrls.page,
    cleanedQuery
  );
};
// 资源保存
export const resSave = (param?: object) => {
  return http.axiosPost<Result>(otaBusResourceUrls.save, param);
};
// 资源修改
export const resUpdate = (param?: object) => {
  return http.axiosPut<Result>(otaBusResourceUrls.update, param);
};
// 资源删除
export const resDelete = (param?: object) => {
  return http.axiosDelete<Result>(otaBusResourceUrls.delete + param);
};
// 资源推送
export const resPush = (param?: object) => {
  return http.axiosPost<Result>(otaBusResourceUrls.push, param);
};
