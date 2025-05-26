import { http } from "@/utils/http";
import qs from "qs";

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

const propertyBusFixUrls = {
  page: `/api/upms/propertyBusFix/page`,
  save: "/api/upms/propertyBusFix/save",
  delete: `/api/upms/propertyBusFix/`,
  update: "/api/upms/propertyBusFix/update",
  downloadImportTemplate: "/api/upms/propertyBusFix/downloadImportTemplate",
  importExcel: "/api/upms/propertyBusFix/importExcel"
};

// 固定资产分页
export const propertyBusFixPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(propertyBusFixUrls.page, query);
};
// 固定资产保存
export const propertyBusFixSave = (param?: object) => {
  return http.axiosPostRequest<Result>(propertyBusFixUrls.save, param);
};
// 固定资产修改
export const propertyBusFixUpdate = (param?: object) => {
  return http.axiosPut<Result>(propertyBusFixUrls.update, param);
};
// 固定资产删除
export const propertyBusFixDelete = (param?: object) => {
  return http.axiosDelete<Result>(propertyBusFixUrls.delete + param);
};

// 下载模板
export const downloadTemplate = () => {
  let param = {
    templateName: "办公用品台账"
  };
  return http.downloadUrlMode(
    propertyBusFixUrls.downloadImportTemplate + "?" + qs.stringify(param),
    "get",
    "固定资产台账.xlsx",
    null
  );
};

// 导入数据
export const importExcel = (param?: any) => {
  const formData = new FormData();
  formData.append("file", param);
  return http.uploadFile(propertyBusFixUrls.importExcel, formData);
};
