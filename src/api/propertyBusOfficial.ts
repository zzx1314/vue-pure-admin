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

const propertyBusOfficialUrls = {
  page: `/api/upms/propertyBusOfficial/page`,
  save: "/api/upms/propertyBusOfficial/save",
  delete: `/api/upms/propertyBusOfficial/`,
  update: "/api/upms/propertyBusOfficial/update",
  downloadImportTemplate: "/api/upms/propertyBusFix/downloadImportTemplate",
  importExcel: "/api/upms/propertyBusOfficial/importExcel"
};

// 办公资产分页
export const propertyBusOfficialPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(propertyBusOfficialUrls.page, query);
};
// 办公资产保存
export const propertyBusOfficialSave = (param?: object) => {
  return http.axiosPostRequest<Result>(propertyBusOfficialUrls.save, param);
};
// 办公资产修改
export const propertyBusOfficialUpdate = (param?: object) => {
  return http.axiosPut<Result>(propertyBusOfficialUrls.update, param);
};
// 办公资产删除
export const propertyBusOfficialDelete = (param?: object) => {
  return http.axiosDelete<Result>(propertyBusOfficialUrls.delete + param);
};
// 下载模板
export const downloadTemplate = () => {
  let param = {
    templateName: "办公用品台账"
  };
  return http.downloadUrlMode(
    propertyBusOfficialUrls.downloadImportTemplate + "?" + qs.stringify(param),
    "get",
    "办公用品台账.xlsx",
    null
  );
};

// 导入数据
export const importExcel = (param?: any) => {
  const formData = new FormData();
  formData.append("file", param);
  return http.uploadFile(propertyBusOfficialUrls.importExcel, formData);
};
