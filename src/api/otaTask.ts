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

const otaBusTaskUrls = {
  page: `/api/ota/otaBusTask/page`,
  save: "/api/ota/otaBusTask/save",
  delete: `/api/ota/otaBusTask/`,
  update: "/api/ota/otaBusTask/update",
  push: "/api/ota/otaBusTask/push",
  getById: "/api/ota/otaBusTask/",
  downLog: "/api/ota/otaBusTask/downLog",
  statistics: "/api/ota/otaBusTask/statistics"
};

// 任务分页
export const taskPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(otaBusTaskUrls.page, query);
};
// 任务保存
export const taskSave = (param?: object) => {
  return http.axiosPostRequest<Result>(otaBusTaskUrls.save, param);
};
// 任务修改
export const taskUpdate = (param?: object) => {
  return http.axiosPut<Result>(otaBusTaskUrls.update, param);
};
// 任务删除
export const taskDelete = (param?: object) => {
  return http.axiosDelete<Result>(otaBusTaskUrls.delete + param);
};
// 查询详情信息
export const taskGetById = (param?: object) => {
  return http.axiosGet<any>(otaBusTaskUrls.getById + param);
};

export const taskStatistics = (param?: object) => {
  return http.axiosGet<any>(otaBusTaskUrls.statistics, param);
};
export const downLog = (param?: any) => {
  const query = {
    taskId: param.taskId,
    devId: param.id
  };
  return http.downloadUrlMode(
    otaBusTaskUrls.downLog,
    "post",
    param.logFileName,
    query
  );
};
