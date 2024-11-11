// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "采集器ID",
      width: 120,
      prop: "collectorId",
      valueType: "copy",
      tooltip: "由英文或者特殊符号组成"
    },
    {
      label: "采集器IP",
      width: 120,
      prop: "collectorIp"
    },
    {
      label: "备注",
      width: 120,
      prop: "remark",
      valueType: "textarea",
      tooltip: "由英文或者特殊符号组成"
    }
  ];
  return {
    columnsForm
  };
}
