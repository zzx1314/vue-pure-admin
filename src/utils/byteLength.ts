/** 返回字符串按 UTF-8 编码计算的字节数。 */
export function getUtf8ByteLength(value: unknown): number {
  return new TextEncoder().encode(String(value ?? "")).length;
}

/** Element Plus 表单规则：限制字段最大 UTF-8 字节数。 */
export function maxUtf8BytesRule(label: string, maxBytes = 15) {
  return {
    validator: (
      _rule: unknown,
      value: unknown,
      callback: (error?: Error) => void
    ) => {
      if (getUtf8ByteLength(value) > maxBytes) {
        callback(new Error(`${label}最多${maxBytes}字节`));
        return;
      }
      callback();
    },
    trigger: ["blur", "change"]
  };
}
