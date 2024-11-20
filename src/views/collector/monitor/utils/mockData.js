import { createRandom } from "./utils";
const mockData = {
  // 横向柱形图
  regionData: {
    regions: [
      { id: 1, name: "华北", value: createRandom(1, 100) },
      { id: 2, name: "东北", value: createRandom(1, 100) },
      { id: 3, name: "华东", value: createRandom(1, 100) },
      { id: 4, name: "中南", value: createRandom(1, 100) },
      { id: 5, name: "西南", value: createRandom(1, 100) },
      { id: 6, name: "西北", value: createRandom(1, 100) }
    ]
  },
  // 纵向图
  verData: {
    servers: [
      { id: 1, name: "服务1", value: createRandom(1, 100) },
      { id: 2, name: "服务2", value: createRandom(1, 100) },
      { id: 3, name: "服务3", value: createRandom(1, 100) },
      { id: 4, name: "服务4", value: createRandom(1, 100) },
      { id: 5, name: "服务5", value: createRandom(1, 100) },
      { id: 6, name: "服务6", value: createRandom(1, 100) }
    ]
  },
  // 雷达图
  riskData: {
    risks: [
      { id: 1, name: "华北", value: createRandom(1, 100) },
      { id: 2, name: "东北", value: createRandom(1, 100) },
      { id: 3, name: "华东", value: createRandom(1, 100) },
      { id: 4, name: "中南", value: createRandom(1, 100) },
      { id: 5, name: "西南", value: createRandom(1, 100) },
      { id: 6, name: "西北", value: createRandom(1, 100) }
    ]
  },
  // 环形图
  abnormalData: {
    abnormals: [
      { id: 1, name: "华北", value: createRandom(300, 500) },
      { id: 2, name: "东北", value: createRandom(300, 500) },
      { id: 3, name: "华东", value: createRandom(300, 500) },
      { id: 4, name: "中南", value: createRandom(300, 500) },
      { id: 5, name: "西南", value: createRandom(300, 500) },
      { id: 6, name: "西北", value: createRandom(300, 500) }
    ]
  },
  pieData: {
    datas: [
      {
        value: 100,
        name: "广州占比",
        percentage: "5%",
        color: "#34D160"
      },
      {
        value: 200,
        name: "深圳占比",
        percentage: "4%",
        color: "#027FF2"
      },
      {
        value: 300,
        name: "东莞占比",
        percentage: "8%",
        color: "#8A00E1"
      },
      {
        value: 400,
        name: "佛山占比",
        percentage: "10%",
        color: "#F19610"
      },
      {
        value: 500,
        name: "中山占比",
        percentage: "20%",
        color: "#6054FF"
      },
      {
        value: 600,
        name: "珠海占比",
        percentage: "40%",
        color: "#00C6FF"
      }
    ]
  },
  // 关系图
  relationData: {
    relations: [
      {
        id: 1,
        name: "上级平台1",
        source: "上级平台1",
        speed: createRandom(1, 200),
        target: "数据中心",
        value: [0, 300]
      },
      {
        id: 2,
        name: "上级平台2",
        source: "上级平台2",
        speed: createRandom(1, 200),
        target: "数据中心",
        value: [0, 100]
      },
      {
        id: 3,
        name: "子级平台1",
        source: "数据中心",
        speed: createRandom(1, 200),
        target: "子级平台1",
        value: [100, 100]
      },
      {
        id: 4,
        name: "子级平台2",
        source: "数据中心",
        speed: createRandom(1, 200),
        target: "子级平台2",
        value: [100, 300]
      },
      { id: 0, name: "数据中心", speed: createRandom(1, 200), value: [50, 200] }
    ]
  },
  serverData: {
    servers: [
      {
        id: 1,
        name: "服务1",
        value: 84
      },
      {
        id: 2,
        name: "服务2",
        value: 86
      },
      {
        id: 3,
        name: "服务3",
        value: 49
      },
      {
        id: 4,
        name: "服务4",
        value: 44
      },
      {
        id: 5,
        name: "服务5",
        value: 58
      },
      {
        id: 6,
        name: "服务6",
        value: 38
      }
    ]
  },
  lineChartData: {
    datas: [
      {
        name: "温度",
        data: [30, 15, 2, 18, 30, 40, 30, 32, 35, 27, 23, 16]
      },
      {
        name: "湿度",
        data: [15, 18, 12, 28, 20, 13, 20, 12, 25, 10, 9, 5]
      }
    ]
  },
  // 文档云图
  wordCloudData: {
    datas: [
      { value: createRandom(1, 100), name: "企联网" },
      { value: createRandom(1, 100), name: "智农通" },
      { value: createRandom(1, 100), name: "OPPO" },
      { value: createRandom(1, 100), name: "HONOR" },
      { value: createRandom(1, 100), name: "红米" },
      { value: createRandom(1, 100), name: "小米" },
      { value: createRandom(1, 100), name: "华为" },
      { value: createRandom(1, 100), name: "苹果" },
      { value: createRandom(1, 100), name: "魅族" },
      { value: createRandom(1, 100), name: "诺基亚" },
      { value: createRandom(1, 100), name: "美图" },
      { value: createRandom(1, 100), name: "锤子" },
      { value: createRandom(1, 100), name: "SAMSUNG" },
      { value: createRandom(1, 100), name: "金立" }
    ]
  },
  // 总览数据
  totalData: {
    db: createRandom(10000, 90000),
    hb: createRandom(10000, 90000),
    hd: createRandom(10000, 90000),
    total: createRandom(100000, 9000000),
    xb: createRandom(10000, 90000),
    xn: createRandom(10000, 90000),
    zn: createRandom(10000, 90000)
  },
  // 地图
  mapData: {
    categoryData: {
      2019: [
        { name: "北京", value: createRandom(1, 100) },
        { name: "天津", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "内蒙古", value: createRandom(1, 100) },
        { name: "辽宁", value: createRandom(1, 100) },
        { name: "吉林", value: createRandom(1, 100) },
        { name: "黑龙江", value: createRandom(1, 100) },
        { name: "上海", value: createRandom(1, 100) },
        { name: "江苏", value: createRandom(1, 100) },
        { name: "安徽", value: createRandom(1, 100) },
        { name: "浙江", value: createRandom(1, 100) },
        { name: "福建", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "山东", value: createRandom(1, 100) },
        { name: "河南", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "云南", value: createRandom(1, 100) }
      ],
      2020: [
        { name: "北京", value: createRandom(1, 100) },
        { name: "天津", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "内蒙古", value: createRandom(1, 100) },
        { name: "辽宁", value: createRandom(1, 100) },
        { name: "吉林", value: createRandom(1, 100) },
        { name: "黑龙江", value: createRandom(1, 100) },
        { name: "上海", value: createRandom(1, 100) },
        { name: "江苏", value: createRandom(1, 100) },
        { name: "安徽", value: createRandom(1, 100) },
        { name: "浙江", value: createRandom(1, 100) },
        { name: "福建", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "山东", value: createRandom(1, 100) },
        { name: "河南", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "云南", value: createRandom(1, 100) }
      ],
      2021: [
        { name: "北京", value: createRandom(1, 100) },
        { name: "天津", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "内蒙古", value: createRandom(1, 100) },
        { name: "辽宁", value: createRandom(1, 100) },
        { name: "吉林", value: createRandom(1, 100) },
        { name: "黑龙江", value: createRandom(1, 100) },
        { name: "上海", value: createRandom(1, 100) },
        { name: "江苏", value: createRandom(1, 100) },
        { name: "安徽", value: createRandom(1, 100) },
        { name: "浙江", value: createRandom(1, 100) },
        { name: "福建", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "山东", value: createRandom(1, 100) },
        { name: "河南", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "云南", value: createRandom(1, 100) }
      ],
      2022: [
        { name: "北京", value: createRandom(1, 100) },
        { name: "天津", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "内蒙古", value: createRandom(1, 100) },
        { name: "辽宁", value: createRandom(1, 100) },
        { name: "吉林", value: createRandom(1, 100) },
        { name: "黑龙江", value: createRandom(1, 100) },
        { name: "上海", value: createRandom(1, 100) },
        { name: "江苏", value: createRandom(1, 100) },
        { name: "安徽", value: createRandom(1, 100) },
        { name: "浙江", value: createRandom(1, 100) },
        { name: "福建", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "山东", value: createRandom(1, 100) },
        { name: "河南", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "云南", value: createRandom(1, 100) }
      ],
      2023: [
        { name: "北京", value: createRandom(1, 100) },
        { name: "天津", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "内蒙古", value: createRandom(1, 100) },
        { name: "辽宁", value: createRandom(1, 100) },
        { name: "吉林", value: createRandom(1, 100) },
        { name: "黑龙江", value: createRandom(1, 100) },
        { name: "上海", value: createRandom(1, 100) },
        { name: "江苏", value: createRandom(1, 100) },
        { name: "安徽", value: createRandom(1, 100) },
        { name: "浙江", value: createRandom(1, 100) },
        { name: "福建", value: createRandom(1, 100) },
        { name: "山西", value: createRandom(1, 100) },
        { name: "山东", value: createRandom(1, 100) },
        { name: "河南", value: createRandom(1, 100) },
        { name: "河北", value: createRandom(1, 100) },
        { name: "云南", value: createRandom(1, 100) }
      ]
    },
    colors: [
      "#1DE9B6",
      "#F46E36",
      "#04B9FF",
      "#5DBD32",
      "#FFC809",
      "#FB95D5",
      "BDA29A",
      "6E7074",
      "#546570",
      "C4CCD3"
    ],
    topData: {
      2019: [
        { name: "天津", value: [117.2, 39.12, 84.1] },
        { name: "河北", value: [114.52, 38.05, 68.1] },
        { name: "河南", value: [113.62, 34.75, 50.1] },
        { name: "山东", value: [116.98, 36.67, 80.1] },
        { name: "安徽", value: [117.4219, 38.4189, 60] }
      ],
      2020: [
        { name: "山西", value: [112.55, 37.87, 84.1] },
        { name: "内蒙", value: [111.73, 40.83, 68.1] },
        { name: "辽宁", value: [123.43, 41.8, 50.1] },
        { name: "山东", value: [116.98, 36.67, 80.1] },
        { name: "吉林", value: [125.32, 43.9, 60] }
      ],
      2021: [
        { name: "天津", value: [117.2, 39.12, 84.1] },
        { name: "河北", value: [114.52, 38.05, 68.1] },
        { name: "河南", value: [113.62, 34.75, 50.1] },
        { name: "山东", value: [116.98, 36.67, 80.1] },
        { name: "安徽", value: [117.4219, 39.4189, 60] }
      ],
      2022: [
        { name: "重庆", value: [106.55, 29.57, 84.1] },
        { name: "四川", value: [104.07, 30.67, 68.1] },
        { name: "贵州", value: [106.63, 26.65, 50.1] },
        { name: "云南", value: [102.72, 25.05, 80.1] },
        { name: "广西", value: [108.37, 22.82, 60] }
      ],
      2023: [
        { name: "陕西", value: [108.93, 34.27, 84.1] },
        { name: "甘肃", value: [103.82, 36.07, 68.1] },
        { name: "宁夏", value: [106.28, 38.47, 50.1] },
        { name: "新疆", value: [87.62, 43.82, 80.1] },
        { name: "云南", value: [102.72, 25.05, 60] }
      ]
    },
    voltageLevel: ["2019", "2020", "2021", "2022", "2023"]
  }
};

export default mockData;
