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

const collectorBusSensorUrls = {
  page: `/api/collector/collectorBusSensor/page`,
  save: "/api/collector/collectorBusSensor/save",
  delete: `/api/collector/collectorBusSensor/`,
  update: "/api/collector/collectorBusSensor/update"
};

// 采集器下的传感器分页
export const collectorBusSensorPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(collectorBusSensorUrls.page, query);
};
// 采集器下的传感器保存
export const collectorBusSensorSave = (param?: object) => {
  return http.axiosPostRequest<Result>(collectorBusSensorUrls.save, param);
};
// 采集器下的传感器修改
export const collectorBusSensorUpdate = (param?: object) => {
  return http.axiosPut<Result>(collectorBusSensorUrls.update, param);
};
// 采集器下的传感器删除
export const collectorBusSensorDelete = (param?: object) => {
  return http.axiosDelete<Result>(collectorBusSensorUrls.delete + param);
};
