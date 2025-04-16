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

const actThTaskHisUrls = {
  page: `/api/upms/activity/getMyHisTaskPage`,
  save: "/api/upms/activity/save",
  delete: `/api/upms/activity/`,
  update: "/api/upms/activity/update"
};

// 历史审批表分页
export const actThTaskHisPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(actThTaskHisUrls.page, query);
};
// 历史审批表保存
export const actThTaskHisSave = (param?: object) => {
  return http.axiosPostRequest<Result>(actThTaskHisUrls.save, param);
};
// 历史审批表修改
export const actThTaskHisUpdate = (param?: object) => {
  return http.axiosPut<Result>(actThTaskHisUrls.update, param);
};
// 历史审批表删除
export const actThTaskHisDelete = (param?: object) => {
  return http.axiosDelete<Result>(actThTaskHisUrls.delete + param);
};
