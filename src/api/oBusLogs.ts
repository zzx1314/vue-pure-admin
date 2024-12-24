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

const oBusLogsUrls = {
  page: `/api/o/oBusLogs/page`,
  save: "/api/o/oBusLogs/save",
  delete: `/api/o/oBusLogs/`,
  update: "/api/o/oBusLogs/update"
};

// 设备日志分页
export const oBusLogsPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(oBusLogsUrls.page, query);
};
// 设备日志保存
export const oBusLogsSave = (param?: object) => {
  return http.axiosPostRequest<Result>(oBusLogsUrls.save, param);
};
// 设备日志修改
export const oBusLogsUpdate = (param?: object) => {
  return http.axiosPut<Result>(oBusLogsUrls.update, param);
};
// 设备日志删除
export const oBusLogsDelete = (param?: object) => {
  return http.axiosDelete<Result>(oBusLogsUrls.delete + param);
};
