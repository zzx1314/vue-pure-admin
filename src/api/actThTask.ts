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

const actThTaskUrls = {
  page: `/api/upms/activity/getMyTaskPage`,
  getProcessInstanceId: `/api/upms/activity/getProcessInstanceId/`,
  getHistoryApprovalOpinion: `/api/upms/activity/getHistoryApprovalOpinion/`,
  getNextNode: `/api/upms/activity/getNextNode/`,
  save: "/api/upms/activity/save",
  delete: `/api/upms/activity/`,
  update: "/api/upms/activity/update"
};

// 审批任务表分页
export const actThTaskPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(actThTaskUrls.page, query);
};

// 查看流程图
export const actThTaskGetProcessInstanceId = (param?: string) => {
  return http.axiosGetRequest<Result>(
    actThTaskUrls.getProcessInstanceId + param,
    {}
  );
};

// 审批任务表保存
export const actThTaskSave = (param?: object) => {
  return http.axiosPostRequest<Result>(actThTaskUrls.save, param);
};
// 审批任务表修改
export const actThTaskUpdate = (param?: object) => {
  return http.axiosPut<Result>(actThTaskUrls.update, param);
};
// 审批任务表删除
export const actThTaskDelete = (param?: object) => {
  return http.axiosDelete<Result>(actThTaskUrls.delete + param);
};
// 获取审批意见
export const actThTaskGetHistoryApprovalOpinion = (
  businessId?: string,
  businessType?: string
) => {
  return http.axiosGetRequest<Result>(
    actThTaskUrls.getHistoryApprovalOpinion + businessId + "/" + businessType,
    {}
  );
};
// 获取下一个审批节点
export const actThTaskGetNextNode = (param?: string) => {
  return http.axiosGetRequest<Result>(actThTaskUrls.getNextNode + param, {});
};
