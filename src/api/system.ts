import { http } from "@/utils/http";
import internal from "stream";

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

const orgurls = {
  allList: `/api/upms/sysOrg/allList`,
  saveSysOrg: `/api/upms/sysOrg`,
  updateById: `/api/upms/sysOrg`,
  removeById: `/api/upms/sysOrg/`
};

const userUrls = {
  userPage: `/api/upms/sysUser/page`,
  saveUser: "/api/upms/sysUser",
  deleteUserById: "/api/upms/sysUser/",
  update: "/api/upms/sysUser",
  resetPwd: "/api/upms/sysUser/resetPwd"
};

const roleUrls = {
  rolePage: `/api/upms/sysRole/page`,
  listAll: "/api/upms/sysRole/list",
  save: "/api/upms/sysRole",
  update: "/api/upms/sysRole",
  deleteById: "/api/upms/sysRole/"
};

const menuUrls = {
  menuPage: `/api/upms/sysMenu/allList`,
  saveSysMenu: `/api/upms/sysMenu`,
  updateSysMenuById: `/api/upms/sysMenu`,
  deleteSysMenuById: `/api/upms/sysMenu/`,
  getSysMenuByRoleId: `/api/upms/sysMenu/`
};

const authUrls = {
  getMenuData: `/api/upms/sysAuth/getMenuData/`,
  getRoleData: `/api/upms/sysAuth/getRoleData`,
  setRoleAuth: `/api/upms/sysAuth/setRoleAuth`,
  setMenuAuth: `/api/upms/sysAuth/setMenuAuth`
};

const fileUploadUrls = {
  taskInfo: `/api/upms/minio/tasks/`,
  initTask: `/api/upms/minio/tasks/init`,
  preSignUrl: `/api/upms/minio/tasks/preSignUrl/`,
  merge: `/api/upms/minio/tasks/merge/`
};

const fileMinoUp = {
  checkFileByMd5: `/api/upms/files/multipart/check/`,
  initMultiPartUpload: "/api/upms/files/multipart/init",
  mergeMultipartUpload: "/api/upms/files/multipart/merge/",
  downloadMultipartFile: "/api/upms/files/download/",
  getFileList: "/api/upms/files/list"
};
export const checkFileByMd5 = (data: object, busstr: Object) => {
  return http.axiosGetRequest<Result>(fileMinoUp.checkFileByMd5 + data, busstr);
};

type initMultPartFileResultType = {
  code: number;
  data: {
    urls: Array<any>;
  };
};
export const initMultPartFile = (data?: object) => {
  return http.axiosPostRequest<initMultPartFileResultType>(
    fileMinoUp.initMultiPartUpload,
    data
  );
};

export const mergeFileByMd5 = (data?: object) => {
  return http.axiosPostRequest<Result>(fileMinoUp.mergeMultipartUpload + data);
};

type queryParam = {
  range: string;
  id: object;
};
export const chunkDownloadFile = (data: queryParam) => {
  return http.axiosGetDown(
    fileMinoUp.downloadMultipartFile + data.id,
    data.range
  );
};

export const fetchFileList = () => {
  return http.axiosGet<Result>(fileMinoUp.getFileList);
};

export const taskInfo = (data?: object) => {
  return http.axiosGet<Result>(fileUploadUrls.taskInfo + data);
};

export const initTask = (data?: object) => {
  return http.axiosPostRequest<Result>(fileUploadUrls.initTask, data);
};

type upParam = {
  identifier: object;
  partNumber: number;
};
export const preSignUrl = (data: upParam) => {
  return http.axiosGet<Result>(
    fileUploadUrls.preSignUrl + data.identifier + "/" + data.partNumber
  );
};

export const merge = (data?: object) => {
  return http.axiosPostRequest<Result>(fileUploadUrls.merge + data);
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.axiosGetRequest<Result>(orgurls.allList, data);
};

/**
 * 保存部门
 */
export const saveSysOrg = (param?: object) => {
  return http.axiosPostRequest<Result>(orgurls.saveSysOrg, param);
};

/**
 * 修改部门
 */
export const updateById = (param?: object) => {
  return http.axiosPut<Result>(orgurls.updateById, param);
};

/**
 * 删除部门
 */
export const removeById = (param: internal) => {
  return http.axiosDelete<Result>(orgurls.removeById + param);
};

/**
 * 分页查询用户
 */
export const userPage = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(userUrls.userPage, query);
};

/**
 * 重置用户
 */
export const userResetPwd = (param?: object) => {
  return http.axiosPut<Result>(userUrls.resetPwd, param);
};

/**
 * 删除用户
 */
export const removeUserById = (param: internal) => {
  return http.axiosDelete<Result>(userUrls.deleteUserById + param);
};

/** 修改用户 */
export const updateUser = (param: object) => {
  return http.axiosPut<Result>(userUrls.update, param);
};

/**
 * 重置用户密码
 */
export const saveUser = (param?: object) => {
  return http.axiosPostRequest<Result>(userUrls.saveUser, param);
};

/** 获取角色管理列表 */
export const getRoleList = (query?: object) => {
  return http.axiosGetRequest<ResultPage>(roleUrls.rolePage, query);
};

/** 保存角色 */
export const saveRole = (param: object) => {
  return http.axiosPostRequest<Result>(roleUrls.save, param);
};

/** 修改角色 */
export const updateRole = (param: object) => {
  return http.axiosPut<Result>(roleUrls.update, param);
};

/** 删除角色 */
export const deleteRole = (param: object) => {
  return http.axiosDelete<Result>(roleUrls.deleteById + param, {});
};

/** 获取所有角色 */
export const listAllRole = () => {
  return http.axiosGetRequest<Result>(roleUrls.listAll, {});
};

/** 菜单页面 */
export const menuPage = (query?: object) => {
  return http.axiosGet<Result>(menuUrls.menuPage, query);
};

/** 保存菜单 */
export const saveSysMenu = (param?: object) => {
  return http.axiosPostRequest<Result>(menuUrls.saveSysMenu, param);
};

/** 修改菜单 */
export const updateSysMenuById = (param?: object) => {
  return http.axiosPut<Result>(menuUrls.updateSysMenuById, param);
};

/**删除菜单 */
export const deleteSysMenu = (param?: object) => {
  return http.axiosDelete<Result>(menuUrls.getSysMenuByRoleId + param);
};

/** 获取权限菜单列表 */
export const getMenuData = (adminCode?: string) => {
  return http.axiosGetRequest<Result>(authUrls.getMenuData + adminCode, {});
};

/** 获取角色列表 */
export const getRoleData = (data?: object) => {
  return http.axiosGetRequest<Result>(authUrls.getRoleData, data);
};

/**设置角色权限 */
export const setRoleAuth = (param?: object) => {
  return http.axiosPostRequest<Result>(authUrls.setRoleAuth, param);
};

/**设置菜单权限 */
export const setMenuAuth = (param?: object) => {
  return http.axiosPostRequest<Result>(authUrls.setMenuAuth, param);
};
