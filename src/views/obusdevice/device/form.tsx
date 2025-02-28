// form表单
import type { PlusColumn } from "plus-pro-components";
import { h } from "vue";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "设备ID",
      prop: "deviceId",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "操作系统",
      fieldProps: {
        disabled: true
      },
      prop: "os"
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "系统架构",
      prop: "arch",
      fieldProps: {
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

  const columnsFormShellLogin: PlusColumn[] = [
    {
      label: "主机IP",
      prop: "host",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "端口",
      prop: "port"
    },
    {
      label: "用户名",
      prop: "username"
    },
    {
      label: "密码",
      prop: "password",
      valueType: "input",
      fieldProps: {
        type: "password"
      }
    }
  ];

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
        span: 5
      },
      formItemProps: {
        labelWidth: "101px"
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
      label: "状态",
      prop: "status",
      valueType: "select",
      formItemProps: {
        style: {
          width: "100%"
        }
      },
      options: [
        {
          label: "在线状态",
          value: "在线",
          color: "var(--el-color-success)",
          fieldSlot: ({ label, color }) => {
            return h("div", { style: { color } }, `${label}`);
          }
        },
        {
          label: "心跳丢失",
          value: "离线",
          color: "var(--el-color-warning)",
          fieldSlot: ({ label, color }) => {
            return h("div", { style: { color } }, `${label}`);
          }
        },
        {
          label: "离线状态",
          value: "短路",
          color: "var(--el-color-danger)",
          fieldSlot: ({ label, color }) => {
            return h("div", { style: { color } }, `${label}`);
          }
        }
      ],
      colProps: {
        span: 4
      }
    },
    {
      label: "创建开始时间",
      prop: "beginTime",
      valueType: "date-picker",
      type: "date",
      formItemProps: {
        labelWidth: "101px",
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
      label: "创建结束时间",
      prop: "endTime",
      valueType: "date-picker",
      formItemProps: {
        labelWidth: "101px",
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
    columnsForm,
    columnsQueryForm,
    columnsFormShellLogin
  };
}
