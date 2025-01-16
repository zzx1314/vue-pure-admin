// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "设备ID",
      prop: "deviceId",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    },
    {
      label: "操作系统",
      fieldProps: {
        disabled: true
      },
      prop: "os",
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    },
    {
      label: "系统架构",
      prop: "arch",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea",
      formItemProps: {
        style: {
          width: "60%"
        }
      }
    }
  ];

  const columnsFormShellLogin: PlusColumn[] = [
    {
      label: "主机IP",
      prop: "host"
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
        labelWidth: "101px",
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
          label: "已注册",
          value: "已注册"
        },
        {
          label: "在线",
          value: "在线"
        },
        {
          label: "离线",
          value: "离线"
        }
      ],
      colProps: {
        span: 4
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
    columnsForm,
    columnsQueryForm,
    columnsFormShellLogin
  };
}
