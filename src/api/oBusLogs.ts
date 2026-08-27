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
  page: `/api/operation/oBusLogs/page`,
  historyLogPage: `/api/operation/oBusLogs/historyLogPage`,
  save: "/api/operation/oBusLogs/save",
  delete: `/api/operation/oBusLogs/`,
  update: "/api/operation/oBusLogs/update",
  assignCompany: "/api/operation/oBusLogs/assignCompany",
  transferCompany: "/api/operation/oBusLogs/transferCompany",
  downLog: "/api/operation/oBusLogs/downLog/"
};

// 设备日志分页
export const oBusLogsPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(oBusLogsUrls.page, query);
};
// 历史日志分页
export const historyLogPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(oBusLogsUrls.historyLogPage, query);
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

export const downLog = (param?: any, fileName?: any) => {
  return http.downloadUrlMode(
    oBusLogsUrls.downLog + param,
    "post",
    fileName,
    null
  );
};

// 设备日志分配公司（多租户）
export const oBusLogsAssignCompany = (param?: object) => {
  return http.axiosPostRequest<Result>(oBusLogsUrls.assignCompany, param);
};

// 设备日志转移所属公司（多租户）
export const oBusLogsTransferCompany = (param?: object) => {
  return http.axiosPostRequest<Result>(oBusLogsUrls.transferCompany, param);
};
