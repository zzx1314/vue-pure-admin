// form表单
import type { PlusColumn } from "plus-pro-components";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "业务id",
      prop: "businessId",
      valueType: "copy"
    }
  ];

  const columnsApproyForm: PlusColumn[] = [
    {
      label: '审批意见',
      width: 120,
      prop: 'content',
      valueType: 'textarea'
    },
    {
      label: '审批状态',
      width: 120,
      prop: 'status',
      valueType: 'select',
      options: [
        {
          label: '驳回',
          value: '驳回',
          color: 'red'
        },
        {
          label: '通过',
          value: '通过',
          color: 'blue'
        }
      ]
    }
  ]

  const licenseProject: PlusColumn[] = [
    {
      label: "项目名称",
      prop: "projName",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "项目编码",
      prop: "projCode",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "客户账号",
      prop: "customerId",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "特性名称",
      prop: "featuresIdArray",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "授权数量",
      prop: "liceNum",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "授权时间",
      prop: "liceTimeArray",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "备注",
      prop: "remark",
      valueType: "textarea",
      fieldProps: {
        disabled: true
      }
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
    columnsQueryForm,
    columnsApproyForm,
    licenseProject
  };
}
