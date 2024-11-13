// form表单
import type { PlusColumn } from "plus-pro-components";

export function useDictForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "类型",
      prop: "dictType",
      valueType: "select",
      options: [
        {
          label: "用户类",
          value: "用户类"
        },
        {
          label: "系统类",
          value: "系统类"
        }
      ],
      formItemProps: {
        style: {
          width: "50%"
        }
      }
    },
    {
      label: "字典类型",
      prop: "type",
      formItemProps: {
        style: {
          width: "50%"
        }
      }
    },
    {
      label: "字典描述",
      prop: "description",
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
      label: "字典类型",
      prop: "dictType",
      valueType: "copy",
      colProps: {
        span: 5
      }
    },
    {
      label: "字典描述",
      prop: "description",
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
