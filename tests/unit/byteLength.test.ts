import { describe, expect, it, vi } from "vitest";
import { getUtf8ByteLength, maxUtf8BytesRule } from "@/utils/byteLength";

describe("utils/byteLength", () => {
  it("按 UTF-8 计算字节数", () => {
    expect(getUtf8ByteLength("abc")).toBe(3);
    expect(getUtf8ByteLength("中文")).toBe(6);
    expect(getUtf8ByteLength("a中")).toBe(4);
    expect(getUtf8ByteLength("😀")).toBe(4);
  });

  it("空值按空串处理", () => {
    expect(getUtf8ByteLength(null)).toBe(0);
    expect(getUtf8ByteLength(undefined)).toBe(0);
    expect(getUtf8ByteLength("")).toBe(0);
  });

  it("校验规则：超过上限时返回错误信息", () => {
    const rule = maxUtf8BytesRule("应用名称", 5);
    const callback = vi.fn();

    rule.validator(null, "abc", callback);
    expect(callback).toHaveBeenCalledWith();
    expect(callback.mock.calls[0]).toHaveLength(0);

    callback.mockClear();
    rule.validator(null, "中文字", callback);
    const error = callback.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("应用名称最多5字节");
  });

  it("默认上限为 15 字节", () => {
    const rule = maxUtf8BytesRule("名称");
    const callback = vi.fn();
    rule.validator(null, "123456789012345", callback);
    expect(callback.mock.calls[0]).toHaveLength(0);

    callback.mockClear();
    rule.validator(null, "1234567890123456", callback);
    expect(callback.mock.calls[0][0].message).toBe("名称最多15字节");
  });
});
