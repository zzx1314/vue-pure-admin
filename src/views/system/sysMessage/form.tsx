// form表单
import type { PlusColumn } from "plus-pro-components";

export function useSysMessageForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy",
      formItemProps: {
        style: {
          width: "50%"
        }
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
      label: "业务类型",
      prop: "businessType",
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
          label: "已处置",
          value: "已处置"
        },
        {
          label: "待处置",
          value: "待处置"
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
      label: "系统消息",
      prop: "message",
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
      label: "处置内容",
      prop: "handleMessage",
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
      label: "开始时间",
      prop: "beginTime",
      valueType: "date-picker",
      type: "date",
      formItemProps: {
        labelWidth: "80px",
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
        labelWidth: "80px",
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
    columnsForm,
    columnsQueryForm
  };
}
