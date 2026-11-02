import { describe, expect, it } from "vitest";
import {
  appendFieldByUniqueId,
  buildHierarchyTree,
  deleteChildren,
  extractPathList,
  getNodeByUniqueId,
  handleTree
} from "@/utils/tree";

const sample = () => [
  {
    path: "/system",
    children: [
      { path: "/system/user" },
      { path: "/system/role", children: [{ path: "/system/role/detail" }] }
    ]
  },
  { path: "/about" }
];

describe("utils/tree", () => {
  it("buildHierarchyTree：写入 id / parentId / pathList", () => {
    const tree = buildHierarchyTree(sample());
    expect(tree[0]).toMatchObject({ id: 0, parentId: null, pathList: [0] });
    expect(tree[0].children[0]).toMatchObject({ id: 0, parentId: 0, pathList: [0, 0] });
    expect(tree[0].children[1].children[0]).toMatchObject({
      id: 0,
      parentId: 1,
      pathList: [0, 1, 0]
    });
    expect(tree[1]).toMatchObject({ id: 1, parentId: null, pathList: [1] });
  });

  it("buildHierarchyTree：非数组返回空数组", () => {
    expect(buildHierarchyTree(null as any)).toEqual([]);
    expect(buildHierarchyTree([])).toEqual([]);
  });

  it("deleteChildren：只有一个子节点时提升为叶子", () => {
    const tree = deleteChildren([
      { path: "/a", children: [{ path: "/a/only" }] },
      { path: "/b", children: [{ path: "/b/1" }, { path: "/b/2" }] }
    ]);

    expect(tree[0].children).toBeUndefined();
    expect(tree[1].children).toHaveLength(2);
    expect(tree[0].uniqueId).toBe(0);
    expect(tree[1].children[1].uniqueId).toBe("1-1");
  });

  it("extractPathList：只收集有 children 的节点", () => {
    const tree = deleteChildren(buildHierarchyTree(sample()));
    const ids = extractPathList(tree);
    // 顶层两个节点都因有 children 被收集；嵌套 detail 无 children 不收集
    expect(ids).toEqual([0, 1]);
  });

  it("getNodeByUniqueId：广度优先查找嵌套节点", () => {
    // uniqueId 由 deleteChildren 生成；这里保证每层都有 ≥2 个 children，避免被提升为叶子
    const tree = deleteChildren([
      {
        path: "/system",
        children: [
          { path: "/system/user" },
          { path: "/system/role", children: [{ path: "/system/role/detail" }, { path: "/system/role/edit" }] }
        ]
      },
      { path: "/about" }
    ]);

    expect(getNodeByUniqueId(tree, "0-1-0")).toMatchObject({
      path: "/system/role/detail"
    });
    expect(getNodeByUniqueId(tree, "not-exist")).toEqual([]);
  });

  it("appendFieldByUniqueId：只向命中的节点追加字段", () => {
    const tree = deleteChildren(buildHierarchyTree(sample()));
    appendFieldByUniqueId(tree, "0-1", { meta: { title: "角色" } });
    expect(tree[0].children[1].meta).toEqual({ title: "角色" });
    expect(tree[0].children[0].meta).toBeUndefined();
  });

  it("handleTree：扁平列表转树（可自定义字段名）", () => {
    const flat = [
      { key: 1, pid: 0, label: "根" },
      { key: 2, pid: 1, label: "子1" },
      { key: 3, pid: 1, label: "子2" },
      { key: 4, pid: 2, label: "孙" }
    ];
    const tree = handleTree(flat, "key", "pid", "children");

    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe("根");
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children[0].children[0].label).toBe("孙");
  });

  it("handleTree：非数组时安全降级", () => {
    expect(handleTree(undefined as any)).toEqual([]);
  });
});
