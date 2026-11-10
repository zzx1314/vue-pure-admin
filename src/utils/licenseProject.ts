/**
 * 审批流里「授权项目变更」的业务快照解析。
 *
 * <p>发起审批时前端把项目表单塞进 `actThTask.businessServiceChange` 的 `filed` 里
 * （见 `views/otacertifi/proj/hook.tsx` 的 `submitFormApprover`）。项目实体在库里存的是
 * 逗号分隔的 `featuresId`（如 `"1,2"`），而审批弹窗里的特性下拉框绑定的是数组
 * `featuresIdArray`，且选项 value 是数字 id。直接把 `filed` 丢给表单，字段名对不上、
 * 类型也对不上，下拉框就回显不出任何特性。
 *
 * <p>这里把快照规整成表单能直接绑定的形状，审批弹窗与审批历史弹窗共用。
 */

/**
 * 特性 id（逗号串 / 数组 / 单值）→ 数字数组。
 *
 * <p>选项 value 是数字，字符串 `"1"` 与数字 `1` 在 el-select 里不相等，所以统一转数字；
 * 空串、`null`、非数字一律丢弃，避免出现 NaN 这种永远匹配不到选项的值。
 */
export function parseFeatureIds(value?: unknown): number[] {
  if (value === null || value === undefined) return [];
  const list: unknown[] = Array.isArray(value) ? value : String(value).split(",");
  const ids: number[] = [];
  for (const item of list) {
    const text = String(item ?? "").trim();
    if (!text) continue;
    const id = Number(text);
    if (Number.isFinite(id)) ids.push(id);
  }
  return ids;
}

/**
 * 业务快照 `filed` → 审批弹窗的表单数据。
 *
 * <p>保留原始字段（项目名称、编码、客户、授权数量/时长、备注），另外补上
 * `featuresIdArray` 供特性下拉框回显。空快照原样返回，弹窗里就是一串空字段。
 */
export function toLicenseProjectForm<T extends Record<string, any>>(
  filed?: T | null
): (T & { featuresIdArray: number[] }) | null {
  if (!filed) return null;
  const source = filed.featuresIdArray ?? filed.featuresId;
  return { ...filed, featuresIdArray: parseFeatureIds(source) };
}
