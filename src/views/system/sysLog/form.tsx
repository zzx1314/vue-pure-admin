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
      label: "模块",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 5
      },
      formItemProps: {
        style: {
          width: "250px"
        }
      }
    },
    {
      label: "操作",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 5
      },
      formItemProps: {
        style: {
          width: "250px"
        }
      }
    },
    {
      label: "操作人",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 5
      },
      formItemProps: {
        style: {
          width: "250px"
        }
      }
    },
    {
      label: "操作内容",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 5
      },
      formItemProps: {
        style: {
          width: "250px"
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
