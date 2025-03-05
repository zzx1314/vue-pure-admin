// form表单
import type { PlusColumn } from "plus-pro-components";

export function useLogForm() {
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
      label: "IP",
      prop: "ip",
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
      label: "模块",
      prop: "type",
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
      label: "操作",
      prop: "subType",
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
      label: "账号",
      prop: "operator",
      valueType: "copy",
      colProps: {
        span: 4
      },
      formItemProps: {
        labelWidth: "60px",
        style: {
          width: "100%"
        }
      }
    },
    {
      label: "操作内容",
      prop: "action",
      valueType: "copy",
      colProps: {
        span: 5
      },
      formItemProps: {
        labelWidth: "80px",
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
