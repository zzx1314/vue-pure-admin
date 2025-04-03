// form表单
import type { PlusColumn } from "plus-pro-components";
import {usePropertyBusOfficial} from "@/views/property/official/hook";

const {
  addForm,
} = usePropertyBusOfficial()

export function useCollectorBusDevForm() {
  const countSum = (price: number, number: number) => {
    if (!price || !number) {
      return;
    }
    addForm.value.sumMoney = price * number;
  };
  const columnsForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
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
      label: "采购单价",
      prop: "buyPrice",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        precision: 2
      }
    },
    {
      label: "采购数量",
      prop: "buyNumber",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        onBlur: () => {
          console.log('onBlur')
          return countSum(addForm.value.buyPrice, addForm.value.buyNumber);
        }
      }
    },
    {
      label: "采购时间",
      prop: "buyTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
    },
    {
      label: "合计金额",
      prop: "sumMoney",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        precision: 2
      }
    },
    {
      label: "使用数量",
      prop: "useNum",
      valueType: "input-number"
    },
    {
      label: "使用部门",
      prop: "useDept",
      valueType: "copy"
    },
    {
      label: "领用时间",
      prop: "useTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
    },
    {
      label: "领用人",
      prop: "useUser",
      valueType: "copy"
    },
    {
      label: "用途",
      prop: "purpose",
      valueType: "copy"
    },
    {
      label: "实际剩余",
      prop: "actualSurplus",
      valueType: 'input-number'
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea"
    },
    {
      label: "插座序号",
      prop: "socketNumber",
      valueType: "copy"
    },
    {
      label: "签字",
      prop: "sign",
      valueType: "copy"
    }
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
      label: "采购时间",
      prop: "buyTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      },
      colProps: {
        span: 4
      }
    },
    {
      label: "使用部门",
      prop: "useDept",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "领用人",
      prop: "useUser",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "用途",
      prop: "purpose",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "插座序号",
      prop: "socketNumber",
      valueType: "copy",
      colProps: {
        span: 4
      }
    },
    {
      label: "签字",
      prop: "sign",
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
        span: 4
      }
    }
  ];
  return {
    columnsForm,
    columnsQueryForm
  };
}
