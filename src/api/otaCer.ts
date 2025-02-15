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

const otaDevUrls = {
  page: `/api/ota/otaBusCer/page`,
  save: "/api/ota/otaBusCer/save",
  delete: `/api/ota/otaBusCer/`,
  update: "/api/ota/otaBusCer/update",
  getCaList: "/api/ota/otaBusCer/getCaList",
  getSonCer: "/api/ota/otaBusCer/getSonCer/",
  downCer: "/api/ota/otaBusCer/downCer",
  loseEfficacy: "/api/ota/otaBusCer/loseEfficacy/"
};

// otaCa分页
export const cerPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(otaDevUrls.page, query);
};
// OTACa保存
export const cerSave = (param?: object) => {
  return http.axiosPostRequest<Result>(otaDevUrls.save, param);
};
// OTACa修改
export const cerUpdate = (param?: object) => {
  return http.axiosPut<Result>(otaDevUrls.update, param);
};
// OTACa删除
export const cerDelete = (param?: object) => {
  return http.axiosDelete<Result>(otaDevUrls.delete + param);
};
// OTACa获取ca列表
export const getCaList = () => {
  return http.axiosGetRequest<Result>(otaDevUrls.getCaList, null);
};
// OTACa获取子证书列表
export const getSonCer = (param?: number) => {
  return http.axiosGetRequest<Result>(otaDevUrls.getSonCer + param, null);
};

type DownParam = {
  id: number;
  type: string;
  parentId: number;
};
// 下载证书
export const downCer = (param?: DownParam) => {
  const query = {
    id: param.id,
    type: param.type,
    parentId: param.parentId
  };
  return http.downloadUrlMode(otaDevUrls.downCer, "post", "证书.zip", query);
};

// 证书失效
export const loseEfficacy = (param?: object) => {
  return http.axiosGet<Result>(otaDevUrls.loseEfficacy + param);
};
