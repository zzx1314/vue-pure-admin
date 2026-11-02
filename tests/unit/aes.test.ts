import { describe, expect, it } from "vitest";
import aes from "@/utils/aes";

describe("utils/aes", () => {
  it("默认密钥可以完成加解密往返（ASCII）", () => {
    const plain = "hello-pure-admin";
    const cipher = aes.encode(plain);
    expect(cipher).not.toBe(plain);
    expect(aes.decode(cipher)).toBe(plain);
  });

  it("中文与符号也能正确往返", () => {
    const plain = "纯-admin_2024!#中文";
    expect(aes.decode(aes.encode(plain))).toBe(plain);
  });

  it("固定 IV = key，因此同一明文结果稳定（可复现）", () => {
    expect(aes.encode("abc")).toBe(aes.encode("abc"));
  });

  it("自定义密钥：同明文不同密钥的密文不同，且只能用对应密钥解开", () => {
    const plain = "secret";
    const c1 = aes.encode(plain, "0123456789abcdef");
    const c2 = aes.encode(plain, "fedcba9876543210");

    expect(c1).not.toBe(c2);
    expect(aes.decode(c1, "0123456789abcdef")).toBe(plain);
    // 密钥不匹配时 crypto-js 会抛 Malformed UTF-8 data（不会返回明文）
    expect(() => aes.decode(c1, "fedcba9876543210")).toThrow();
  });

  it("密文被破坏时抛错，而不是静默返回空串", () => {
    expect(() => aes.decode("not-a-cipher-text")).toThrow();
  });
});
