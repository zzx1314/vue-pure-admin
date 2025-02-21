// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsQueryForm: PlusColumn[] = [
    {
      label: "下发人",
      prop: "username",
      valueType: "copy",
      colProps: {
        span: 4
      },
      formItemProps: {
        style: {
          width: "100%"
        }
      }
    },
    {
      label: "设备ID",
      prop: "deviceId",
      valueType: "copy",
      colProps: {
        span: 4
      },
      formItemProps: {
        style: {
          width: "100%"
        }
      }
    },
    {
      label: "指令内容",
      prop: "content",
      valueType: "copy",
      colProps: {
        span: 4
      },
      formItemProps: {
        style: {
          width: "100%"
        }
      }
    },
    {
      label: "状态",
      prop: "status",
      valueType: "copy",
      colProps: {
        span: 4
      },
      formItemProps: {
        style: {
          width: "100%"
        }
      }
    },
    {
      label: "开始时间",
      prop: "beginTime",
      valueType: "date-picker",
      type: "date",
      formItemProps: {
        style: {
          width: "250px"
        }
      },
      fieldProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
      colProps: {
        span: 4
      }
    },
    {
      label: "结束时间",
      prop: "endTime",
      valueType: "date-picker",
      formItemProps: {
        style: {
          width: "250px"
        }
      },
      fieldProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD"
      },
      colProps: {
        span: 4
      }
    }
  ];
  return {
    columnsQueryForm
  };
}
