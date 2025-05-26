// form表单
import type { PlusColumn } from "plus-pro-components";
export function useCollectorBusDevForm() {
  const columnsQueryForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "颜色",
      prop: "colour",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "单位",
      prop: "deptName",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "采购时间",
      prop: "buyTime",
      valueType: "date-picker",
      labelWidth: 80,
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
      formItemProps: {
        style: {
          width: "250px"
        }
      },
      colProps: {
        span: 5,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "使用部门",
      prop: "useDept",
      valueType: "copy",
      labelWidth: 80,
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "领用人",
      prop: "useUser",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "用途",
      prop: "purpose",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "插座序号",
      prop: "socketNumber",
      valueType: "copy",
      labelWidth: 80,
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "签字",
      prop: "sign",
      valueType: "copy",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "开始时间",
      prop: "beginTime",
      valueType: "date-picker",
      labelWidth: 80,
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
        span: 4,
        "padding-left": "0px",
        "padding-right": "0px"
      }
    },
    {
      label: "结束时间",
      prop: "endTime",
      labelWidth: 80,
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
        span: 4,
        "padding-left": "0px",
        "padding-right": "0px"
      }
    }
  ];
  return {
    columnsQueryForm
  };
}
