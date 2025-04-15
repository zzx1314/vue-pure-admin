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

const cerProjUrls = {
  page: `/api/cer/licenseBusProj/page`,
  save: "/api/cer/licenseBusProj/save",
  delete: `/api/cer/licenseBusProj/`,
  update: "/api/cer/licenseBusProj/update",
  getProjSelect: "/api/cer/licenseBusProj/getProjSelect",
  updateCheck: "/api/cer/licenseBusProj/updateCheck"
};

// 项目管理分页
export const projPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(cerProjUrls.page, query);
};
// 项目管理保存
export const projSave = (param?: object) => {
  return http.axiosPostRequest<Result>(cerProjUrls.save, param);
};
// 项目管理修改
export const projUpdate = (param?: object) => {
  return http.axiosPut<Result>(cerProjUrls.update, param);
};
// 项目管理修改
export const projUpdateCheck = (param?: object) => {
  return http.axiosPut<Result>(cerProjUrls.updateCheck, param);
};
// 项目管理删除
export const projDelete = (param?: object) => {
  return http.axiosDelete<Result>(cerProjUrls.delete + param);
};
// 项目下拉框
export const getProjSelectApi = (query?: object) => {
  return http.axiosGetRequest<Result>(cerProjUrls.getProjSelect, query);
};
