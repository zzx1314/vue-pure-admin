// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsQueryForm: PlusColumn[] = [
    {
      label: "设备ID",
      prop: "deviceId",
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
      label: "设备IP",
      prop: "deviceIp",
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
      label: "操作系统",
      prop: "os",
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
      label: "操作系统版本",
      prop: "osVersion",
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
      label: "系统架构",
      prop: "arch",
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
          width: "100%"
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
          width: "100%"
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
