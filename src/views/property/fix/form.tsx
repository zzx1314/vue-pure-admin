// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy"
    },
    {
      label: "型号",
      prop: "model",
      valueType: "copy"
    },
    {
      label: "序列号",
      prop: "serialNumber",
      valueType: "copy"
    },
    {
      label: "颜色",
      prop: "colour",
      valueType: "copy"
    },
    {
      label: "单位",
      prop: "deptName",
      valueType: "copy"
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      valueType: "copy"
    },
    {
      label: "采购时间",
      prop: "buyTime",
      valueType: 'date-picker',
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
    },
    {
      label: "价格",
      prop: "price",
      valueType: "copy"
    },
    {
      label: "数量",
      prop: "number",
      valueType: "input-number"
    },
    {
      label: "合计金额",
      prop: "sumPrice",
      valueType: "copy"
    },
    {
      label: "领用部门",
      prop: "useDept",
      valueType: "copy"
    },
    {
      label: "领用数量",
      prop: "useNumber",
      valueType: "copy"
    },
    {
      label: "领用时间",
      prop: "useTime",
      valueType: 'date-picker',
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
    },
    {
      label: "领用人",
      prop: "useUser",
      valueType: 'copy'
    },
    {
      label: "用途",
      prop: "useWay",
      valueType: 'copy'
    },
    {
      label: "实际结余",
      prop: "actualSurplus",
      valueType: 'copy'
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea"
    },
    {
      label: "采购申请人",
      prop: "buyApplicant",
      valueType: 'copy'
    },
  ];

  const columnsQueryForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "型号",
      prop: "model",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "序列号",
      prop: "serialNumber",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "颜色",
      prop: "colour",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "单位",
      prop: "deptName",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      valueType: "copy",
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
          width: "250px"
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
          width: "250px"
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
    columnsQueryForm
  };
}
