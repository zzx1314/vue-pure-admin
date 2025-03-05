export function useResModeTable() {
  const modeColumns: TableColumnList = [
    {
      type: "selection",
      width: 50,
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 50
    },
    {
      label: "类型",
      prop: "type",
      width: 50,
      cellRenderer: ({ row }) => (
        <el-tag type={row.type === "操作系统" ? "success" : "info"}>
          {row.type}
        </el-tag>
      )
    },
    {
      label: "模块名称",
      prop: "pkgName",
      minWidth: 100
    },
    {
      label: "模块版本",
      prop: "version",
      minWidth: 50
    },
    {
      label: "资源类型",
      prop: "resType",
      minWidth: 50
    },
    {
      label: "资源名称",
      prop: "originFileName",
      minWidth: 100
    },
    {
      label: "资源大小",
      prop: "fileSizeShow",
      minWidth: 100
    },
    {
      label: "账号",
      prop: "operator",
      minWidth: 70
    },
    {
      label: "上传时间",
      minWidth: 150,
      prop: "createTime"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  return { modeColumns };
}
