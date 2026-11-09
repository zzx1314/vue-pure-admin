/**
 * 授权设备状态相关的纯函数。
 *
 * <p>与后端 `LicenseDeviceStatus` 保持同一套口径：前端靠它决定「去激活」按钮是否可点、
 * 状态标签用什么颜色。后端仍然是唯一裁判——这里只做展示层拦截，避免用户点了必然失败的按钮。
 */

/** 设备刚激活、OTA 证书还在生成 */
export const STATUS_PENDING = "待激活";
/** 激活成功并完成上报 */
export const STATUS_ACTIVATED = "已激活";
/** 管理员回收授权：点数已释放，等待设备下一次上报后自行去激活 */
export const STATUS_DEACTIVATED = "去激活";

/** 授权设备状态下拉选项（与后端写入的文案一一对应） */
export const DEVICE_STATUS_OPTIONS = [
  STATUS_PENDING,
  STATUS_ACTIVATED,
  "待更新授权证书",
  "证书生成失败",
  "系统版本和架构异常",
  "系统版本异常",
  "系统架构异常",
  "用户名变化",
  "授权时间发生变化",
  "特性发生变化",
  "授权证书过期",
  "通信证书过期",
  "获取磁盘信息失败",
  "解码授权文件失败",
  "校验授权文件失败",
  "解析json内容失败",
  "设置授权文件信息到内核失败",
  STATUS_DEACTIVATED
];

/**
 * 是否允许去激活。
 *
 * <p>「待激活」说明这台设备从未占用过授权点数，没有可释放的额度；
 * 「去激活」已经释放过，重复点击不应该再扣一次。
 */
export function canDeactivate(cerStatus?: string | null): boolean {
  if (!cerStatus || !cerStatus.trim()) {
    return false;
  }
  return cerStatus !== STATUS_PENDING && cerStatus !== STATUS_DEACTIVATED;
}

/** 状态标签颜色：已激活绿色、去激活灰色、其余按异常红色 */
export function deviceStatusTagType(
  cerStatus?: string | null
): "success" | "info" | "danger" {
  if (cerStatus === STATUS_ACTIVATED) {
    return "success";
  }
  if (cerStatus === STATUS_DEACTIVATED) {
    return "info";
  }
  return "danger";
}

/** 去激活二次确认文案 */
export function deactivateConfirmText(activationCode?: string | null): string {
  const code = activationCode ? `设备 ${activationCode} ` : "该设备 ";
  return `确认对${code}执行去激活？\n\n去激活会立即释放一个授权点数，设备在下一次上报后停止使用授权。\n重新激活时需要重新输入账号密码，授权时间仍按第一次激活的时间起算。`;
}
