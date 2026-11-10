import { describe, expect, it } from "vitest";
import { parseFeatureIds, toLicenseProjectForm } from "@/utils/licenseProject";

describe("utils/licenseProject", () => {
  it("parseFeatureIds：库里存的逗号串 → 数字数组", () => {
    // 项目实体存的是 featuresId（逗号串），下拉框的选项 value 是数字
    expect(parseFeatureIds("1,2")).toEqual([1, 2]);
    expect(parseFeatureIds("3")).toEqual([3]);
    expect(parseFeatureIds([1, 2])).toEqual([1, 2]);
    expect(parseFeatureIds([3, 4])).toEqual([3, 4]);
    expect(parseFeatureIds(5)).toEqual([5]);
  });

  it("parseFeatureIds：空值与脏数据不产生 NaN 选项", () => {
    expect(parseFeatureIds(undefined)).toEqual([]);
    expect(parseFeatureIds(null)).toEqual([]);
    expect(parseFeatureIds("")).toEqual([]);
    expect(parseFeatureIds("  ")).toEqual([]);
    expect(parseFeatureIds("1,,2")).toEqual([1, 2]);
    expect(parseFeatureIds(" 1 , 2 ")).toEqual([1, 2]);
    expect(parseFeatureIds("abc")).toEqual([]);
    expect(parseFeatureIds(["abc", 1])).toEqual([1]);
    // 尾随逗号（旧数据里偶发）
    expect(parseFeatureIds("1,2,")).toEqual([1, 2]);
  });

  it("toLicenseProjectForm：补出 featuresIdArray，其余字段原样保留", () => {
    const form = toLicenseProjectForm({
      id: 7,
      projName: "演示项目",
      projCode: "PROJ-1",
      customerId: 2,
      featuresId: "1,2",
      liceNum: "10",
      liceTime: "365",
      remark: "备注"
    });

    expect(form).toMatchObject({
      id: 7,
      projName: "演示项目",
      projCode: "PROJ-1",
      customerId: 2,
      liceNum: "10",
      liceTime: "365",
      remark: "备注"
    });
    expect(form.featuresIdArray).toEqual([1, 2]);
  });

  it("toLicenseProjectForm：已有 featuresIdArray 时以它为准", () => {
    const form = toLicenseProjectForm({ featuresId: "9", featuresIdArray: [1] });
    expect(form.featuresIdArray).toEqual([1]);
  });

  it("toLicenseProjectForm：没有特性时给空数组，空快照保持 null", () => {
    expect(toLicenseProjectForm({ projName: "无特性" }).featuresIdArray).toEqual(
      []
    );
    expect(toLicenseProjectForm(null)).toBeNull();
    expect(toLicenseProjectForm(undefined)).toBeNull();
  });
});
