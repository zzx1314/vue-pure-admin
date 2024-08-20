import { http } from "@/utils/http";
import { MoreFilled } from "@element-plus/icons-vue";

type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
  };
};

/** 卡片列表 */
export const getCardList = (data?: object) => {
  return http.request<Result>("post", "/getCardList", { data });
};

const activities = [
  {
    content: "V4.4.0",
    timestamp: "2018-04-12 20:46",
    size: "large",
    type: "primary",
    icon: MoreFilled
  },
  {
    content: "V3.4.0",
    timestamp: "2018-04-03 20:46",
    color: "#0bbd87"
  },
  {
    content: "V3.3.0",
    timestamp: "2018-04-03 20:46",
    size: "large"
  },
  {
    content: "V3.2.0",
    timestamp: "2018-04-03 20:46",
    type: "primary",
    hollow: true
  },
  {
    content: "V3.1.0",
    timestamp: "2018-04-03 20:46"
  }
];

/** 版本日志 */
export const getReleases = () => {
  return new Promise(resolve => {
    resolve(activities);
  });
};
