// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsQueryForm: PlusColumn[] = [
    {
      label: "用户",
      prop: "username",
      valueType: "copy",
      colProps: {
        span: 5
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
        span: 5
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
        span: 5
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
      options: [
        {
          label: "已下发",
          value: "已下发"
        },
        {
          label: "执行成功",
          value: "执行成功"
        },
        {
          label: "执行失败",
          value: "执行失败"
        },
        {
          label: "响应超时",
          value: "响应超时"
        }
      ],
      colProps: {
        span: 5
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
        span: 5
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
        span: 5
      }
    }
  ];
  return {
    columnsQueryForm
  };
}
