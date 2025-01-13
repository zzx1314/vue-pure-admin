// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "设备ID",
      prop: "deviceId",
      formItemProps: {
        style: {
          width: "50%"
        },
        disabled: true
      }
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      formItemProps: {
        style: {
          width: "50%"
        },
        disabled: true
      }
    },
    {
      label: "操作系统",
      prop: "os",
      formItemProps: {
        style: {
          width: "50%"
        },
        disabled: true
      }
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      formItemProps: {
        style: {
          width: "50%"
        },
        disabled: true
      }
    },
    {
      label: "系统架构",
      prop: "arch",
      formItemProps: {
        style: {
          width: "50%"
        },
        disabled: true
      }
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea"
    }
  ];

  const columnsQueryForm: PlusColumn[] = [
    {
      label: "设备ID",
      prop: "deviceId",
      colProps: {
        span: 5
      }
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      colProps: {
        span: 5
      }
    },
    {
      label: "操作系统",
      prop: "os",
      colProps: {
        span: 5
      }
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      colProps: {
        span: 5
      },
      formItemProps: {
        labelWidth: "101px",
        style: {
          width: "250px"
        }
      }
    },
    {
      label: "系统架构",
      prop: "arch",
      colProps: {
        span: 5
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
        span: 5
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
        span: 5
      }
    }
  ];
  return {
    columnsForm,
    columnsQueryForm
  };
}
