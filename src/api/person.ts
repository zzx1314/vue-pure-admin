import { http } from "@/utils/http";
import { MerkleTree } from "@/lib/MerkleTree";
import cutFile from "@/lib/cutFile";

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

const personUrls = {
  page: `/api/person/busPersonInfo/page`,
  delete: `/api/person/busPersonInfo/`,
  update: "/api/person/busPersonInfo/update",
  upload: "/api/person/busPersonInfo/upload",
  downPdf: "/api/person/busPersonInfo/downPdf"
};

// 分页
export const personPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(personUrls.page, query);
};
// 修改
export const personUpdate = (param?: object) => {
  return http.axiosPut<Result>(personUrls.update, param);
};
// 删除
export const personDelete = (param?: object) => {
  return http.axiosDelete<Result>(personUrls.delete + param);
};

// 上传
export const personUpload = async (param?: any) => {
  const formData = new FormData();

  const chunks = await cutFile(param);
  const merkleTree = new MerkleTree(chunks.map(chunk => chunk.hash));
  const md5 = merkleTree.getRootHash();
  console.log("计算md5", md5);

  formData.append("file", param);
  formData.append("md5", md5);
  return http.uploadFile<Result>(personUrls.upload, formData);
};

type DownParam = {
  fileName: String;
};
// 下载
export const downPerson = (param?: DownParam) => {
  const query = {
    fileName: param.fileName
  };
  let name = param.fileName.substring(param.fileName.lastIndexOf("/") + 1);
  return http.downloadUrlMode(personUrls.downPdf, "post", name, query);
};

export const preViewPerson = (param?: DownParam) => {
  const query = {
    fileName: param.fileName
  };
  let name = param.fileName.substring(param.fileName.lastIndexOf("/") + 1);
  return http.preViewMode(personUrls.downPdf, "post", name, query);
};
