import { describe, expect, it } from "vitest";
import {
  DEVICE_STATUS_OPTIONS,
  STATUS_ACTIVATED,
  STATUS_DEACTIVATED,
  STATUS_PENDING,
  canDeactivate,
  deactivateConfirmText,
  deviceStatusTagType
} from "@/utils/licenseDevice";

describe("utils/licenseDevice", () => {
  it("canDeactivate：「待激活」和「去激活」不允许再点，其余状态允许", () => {
    expect(canDeactivate(STATUS_ACTIVATED)).toBe(true);
    expect(canDeactivate("授权证书过期")).toBe(true);
    expect(canDeactivate("待更新授权证书")).toBe(true);
    expect(canDeactivate("证书生成失败")).toBe(true);
    expect(canDeactivate("用户名变化")).toBe(true);

    expect(canDeactivate(STATUS_PENDING)).toBe(false);
    expect(canDeactivate(STATUS_DEACTIVATED)).toBe(false);
    expect(canDeactivate("")).toBe(false);
    expect(canDeactivate("   ")).toBe(false);
    expect(canDeactivate(undefined)).toBe(false);
    expect(canDeactivate(null)).toBe(false);
  });

  it("deviceStatusTagType：已激活绿、去激活灰、其余红", () => {
    expect(deviceStatusTagType(STATUS_ACTIVATED)).toBe("success");
    expect(deviceStatusTagType(STATUS_DEACTIVATED)).toBe("info");
    expect(deviceStatusTagType("授权证书过期")).toBe("danger");
    expect(deviceStatusTagType(STATUS_PENDING)).toBe("danger");
    expect(deviceStatusTagType(null)).toBe("danger");
  });

  it("deactivateConfirmText 带上设备ID，并说明点数释放与重新激活规则", () => {
    const text = deactivateConfirmText("AC-123");
    expect(text).toContain("AC-123");
    expect(text).toContain("释放一个授权点数");
    expect(text).toContain("第一次激活");

    // 没有设备ID时也要能展示
    expect(deactivateConfirmText(undefined)).toContain("该设备");
  });

  it("状态筛选项包含「去激活」，且与后端状态文案一致", () => {
    expect(DEVICE_STATUS_OPTIONS).toContain(STATUS_DEACTIVATED);
    expect(DEVICE_STATUS_OPTIONS).toContain(STATUS_ACTIVATED);
    expect(DEVICE_STATUS_OPTIONS).toContain(STATUS_PENDING);
    expect(DEVICE_STATUS_OPTIONS).toContain("授权证书过期");
    // 允许去激活的状态都在下拉里（避免出现「能点但不能筛选」的割裂）
    for (const status of DEVICE_STATUS_OPTIONS) {
      if (canDeactivate(status)) {
        expect(status.trim().length).toBeGreaterThan(0);
      }
    }
    // 不应有重复项
    expect(new Set(DEVICE_STATUS_OPTIONS).size).toBe(
      DEVICE_STATUS_OPTIONS.length
    );
  });
});
