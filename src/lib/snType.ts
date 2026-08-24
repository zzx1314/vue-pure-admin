/**
 * SN号定义规则V1.3
 *
 * SN号由16位（编号1~16）数字或字母构成：
 *   1-2位  产品类型
 *   3位    产品来源
 *   4-5位  产品型号
 *   6位    产品规格
 *   7-8位  生产年份（十进制）
 *   9位    月份（1-9，A-C）
 *   10-11位 日期（十进制）
 *   12-16位 生产序列号（十进制）
 *
 * 文档来源：SN号定义规则V1.3.pdf
 */

/** 产品类型（第1-2位） */
const PRODUCT_TYPE_MAP: Record<string, string> = {
  "00": "边缘计算板卡",
  "01": "鸿蒙板卡",
  "02": "边缘整机",
  "03": "鸿蒙整机"
};

/** 产品来源（第3位） */
const PRODUCT_SOURCE_MAP: Record<string, string> = {
  "0": "自研",
  "1": "定制",
  "2": "外购",
  C: "客户硬件"
};

/** 产品型号（第4-5位） */
const MODEL_MAP: Record<string, string> = {
  "00": "310B",
  "01": "310P",
  "10": "3403",
  "20": "RK3688",
  "21": "RK3568",
  "22": "RK3576",
  "30": "920",
  "40": "3330E"
};

/** 产品规格（第6位），同一型号不同厂家含义不同 */
const SPEC_MAP: Record<string, Record<string, string>> = {
  "00": {
    "0": "全爱套件DK（Atlas200I A2 20T）",
    "1": "瑞泰工业板（Atlas200I A2 20T）",
    "2": "英码（Atlas200I A2 20T）",
    "3": "全爱套件-PCIe卡（Atlas200I A2 20T）"
  },
  "22": {
    "0": "FDC3576",
    "1": "XDC210-视觉导航",
    "2": "XDC210-YD背包"
  }
};

/** 整机/板卡SN对应表（板卡 -> 类型/来源/型号/规格说明） */
const SN_TABLE: Array<{
  board: string;
  type: string;
  source: string;
  model: string;
  spec: string;
  specDesc: string;
}> = [
  {
    board: "Atlas200",
    type: "00",
    source: "2",
    model: "00",
    spec: "0",
    specDesc: "全爱开发套件"
  },
  {
    board: "Atlas200",
    type: "00",
    source: "2",
    model: "00",
    spec: "1",
    specDesc: "瑞泰工业板"
  },
  {
    board: "RK3588",
    type: "00",
    source: "2",
    model: "20",
    spec: "0",
    specDesc: "开发板"
  },
  {
    board: "RK3568",
    type: "00",
    source: "2",
    model: "21",
    spec: "0",
    specDesc: "开发板"
  },
  {
    board: "Sd3403 海鸥派",
    type: "00",
    source: "2",
    model: "10",
    spec: "0",
    specDesc: "开发板"
  },
  {
    board: "FDC RK3576",
    type: "00",
    source: "0",
    model: "22",
    spec: "0",
    specDesc: "自研3576"
  },
  {
    board: "FDC SD3403",
    type: "00",
    source: "0",
    model: "10",
    spec: "0",
    specDesc: "自研3576"
  },
  {
    board: "XDC210",
    type: "02",
    source: "0",
    model: "22",
    spec: "1",
    specDesc: "视觉导航"
  },
  {
    board: "XDC210",
    type: "02",
    source: "0",
    model: "22",
    spec: "2",
    specDesc: "YD算力背包"
  }
];

export interface SnParseResult {
  /** 原始SN号 */
  sn: string;
  /** 是否符合16位长度规则 */
  valid: boolean;
  /** 产品类型（第1-2位） */
  productType: string;
  /** 产品来源（第3位） */
  productSource: string;
  /** 产品型号（第4-5位） */
  model: string;
  /** 产品规格（第6位） */
  spec: string;
  /** 型号+规格解析说明，无匹配返回空字符串 */
  specDesc: string;
  /** 整机/板卡名称，命中SN对应表时返回 */
  board: string;
  /** 生产日期，格式 YY-M-DD */
  produceDate: string;
  /** 生产序列号（第12-16位） */
  serialNo: string;
}

/**
 * 按SN号定义规则V1.3解析SN
 * @param sn 16位SN号
 */
export function parseSnType(sn: string): SnParseResult {
  const raw = (sn || "").trim();
  const result: SnParseResult = {
    sn: raw,
    valid: /^[0-9A-Za-z]{16}$/.test(raw),
    productType: "",
    productSource: "",
    model: "",
    spec: "",
    specDesc: "",
    board: "",
    produceDate: "",
    serialNo: ""
  };

  if (!result.valid) {
    return result;
  }

  const typeCode = raw.substring(0, 2);
  const sourceCode = raw.substring(2, 3);
  const modelCode = raw.substring(3, 5);
  const specCode = raw.substring(5, 6);

  result.productType = PRODUCT_TYPE_MAP[typeCode] || "";
  result.productSource = PRODUCT_SOURCE_MAP[sourceCode] || "";
  result.model = MODEL_MAP[modelCode] || "";
  result.spec = specCode;
  result.specDesc = SPEC_MAP[modelCode]?.[specCode] || "";
  result.produceDate = `${raw.substring(6, 8)}-${raw.substring(8, 9)}-${raw.substring(9, 11)}`;
  result.serialNo = raw.substring(11, 16);

  // 整机/板卡对应表匹配（型号+规格唯一确定）
  const matched = SN_TABLE.find(
    item => item.model === modelCode && item.spec === specCode
  );
  if (matched) {
    result.board = matched.board;
  }

  return result;
}

/**
 * 获取设备类型展示值：优先使用整机/板卡名称，否则返回型号+规格说明
 * 供设备列表/详情页直接展示解析结果
 */
export function resolveDeviceTypeBySn(sn: string): string {
  const parsed = parseSnType(sn);
  if (!parsed.valid) {
    return "";
  }
  if (parsed.board) {
    return parsed.board;
  }
  if (parsed.model && parsed.specDesc) {
    return `${parsed.model}-${parsed.specDesc}`;
  }
  return parsed.model || parsed.productType || "";
}
