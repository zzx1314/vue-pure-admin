// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "采集器ID",
      prop: "collectorId",
      valueType: "copy",
      tooltip: "由英文或者特殊符号组成",
      formItemProps: {
        style: {
          width: "50%"
        }
      }
    },
    {
      label: "采集器IP",
      prop: "collectorIp"
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea"
    }
  ];
  return {
    columnsForm
  };
}
