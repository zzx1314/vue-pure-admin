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

const oBusCommandUrls = {
  page: `/api/operation/command/page`,
  save: "/api/operation/command/save",
  delete: `/api/operation/command/`,
  update: "/api/operation/command/update"
};

// 指令分页
export const oBusCommandPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(oBusCommandUrls.page, query);
};
// 指令保存
export const oBusCommandSave = (param?: object) => {
  return http.axiosPostRequest<Result>(oBusCommandUrls.save, param);
};
// 指令修改
export const oBusCommandUpdate = (param?: object) => {
  return http.axiosPut<Result>(oBusCommandUrls.update, param);
};
// 指令删除
export const oBusCommandDelete = (param?: object) => {
  return http.axiosDelete<Result>(oBusCommandUrls.delete + param);
};
