// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "业务类型",
      prop: "businessType",
      valueType: "copy"
    }
  ];

  const columnsQueryForm: PlusColumn[] = [
    {
      label: "业务类型",
      prop: "businessType",
      valueType: "copy",
      colProps: {
        span: 5
      }
    },
    {
      label: "业务名称",
      prop: "businessName",
      valueType: "copy",
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

  const licenseProject: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "型号",
      prop: "model",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "类型",
      prop: "propertyType",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "序列号",
      prop: "serialNumber",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    }
  ];
  return {
    columnsForm,
    columnsQueryForm,
    licenseProject
  };
}
