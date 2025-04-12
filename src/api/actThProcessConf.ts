import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data?: any;
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
  page: `/api/upms/activity/getProcessConfPage`,
  save: "/api/upms/activity/addProcessConf",
  delete: `/api/upms/activity/deleteProcessConf`,
  update: "/api/upms/activity/editProcessConf",
  deployment: `/api/upms/activity/deployment`,
  getProcessOne: "/api/upms/activity/getProcessOne/"
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
// 业务流程配置表部署
export const actThProcessConfDeployment = (param?: object) => {
  return http.axiosPostRequest<Result>(actThProcessConfUrls.deployment, param);
};
// 业务流程配置表获取流程
export const actThProcessConfGetProcess = (param?: object) => {
  return http.axiosGetRequest<Result>(actThProcessConfUrls.getProcessOne + param, {});
};
