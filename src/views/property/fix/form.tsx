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
      label: "型号",
      prop: "model",
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
      label: "序列号",
      prop: "serialNumber",
      labelWidth: 65,
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
      label: "资产编码",
      prop: "propertyNumber",
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
      valueType: 'date-picker',
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "领用部门",
      prop: "useDept",
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
      label: "领用人",
      prop: "useUser",
      valueType: 'copy',
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
      prop: "useWay",
      valueType: 'copy',
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      colProps: {
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "申请人",
      prop: "buyApplicant",
      valueType: 'copy',
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
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
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
        span: 4,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    }
  ];
  return {
    columnsQueryForm
  };
}
