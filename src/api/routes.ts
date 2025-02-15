import { http } from "@/utils/http";

type Result = {
  code: number;
  data: Array<any>;
  msg: string;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/api/upms/sysMenu");
};
