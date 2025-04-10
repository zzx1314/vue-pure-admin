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

const actThProcessConfUrls = {
  page: `/api/act/actThProcessConf/page`,
  save: "/api/act/actThProcessConf/save",
  delete: `/api/act/actThProcessConf/`,
  update: "/api/act/actThProcessConf/update"
};

// 业务流程配置表分页
export const actThProcessConfPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(actThProcessConfUrls.page, query);
};
// 业务流程配置表保存
export const actThProcessConfSave = (param?: object) => {
  return http.axiosPostRequest<Result>(actThProcessConfUrls.save, param);
};
// 业务流程配置表修改
export const actThProcessConfUpdate = (param?: object) => {
  return http.axiosPut<Result>(actThProcessConfUrls.update, param);
};
// 业务流程配置表删除
export const actThProcessConfDelete = (param?: object) => {
  return http.axiosDelete<Result>(actThProcessConfUrls.delete + param);
};
