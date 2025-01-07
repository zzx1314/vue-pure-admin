export function useResModeTable() {
  const modeColumns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "类型",
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.type === "操作系统" ? "success" : "info"}>
          {row.type}
        </el-tag>
      )
    },
    {
      label: "资源类型",
      prop: "resType",
      minWidth: 100
    },
    {
      label: "组件包名称",
      prop: "pkgName",
      minWidth: 100
    },
    {
      label: "组件包版本",
      prop: "version",
      minWidth: 100
    },
    {
      label: "文件大小",
      prop: "fileSizeShow",
      minWidth: 120
    },
    {
      label: "文件名称",
      prop: "originFileName",
      minWidth: 120
    },
    {
      label: "操作人",
      prop: "operator",
      minWidth: 120
    },
    {
      label: "上传时间",
      minWidth: 150,
      prop: "createTime"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
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
