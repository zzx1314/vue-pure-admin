// form表单
import type { PlusColumn } from "plus-pro-components";
import { getUserByRoleIdNoPage } from "@/api/user";
import { getFeatureSelect } from "@/api/cerFeatures";

export function useCollectorBusDevForm() {
  const columnsForm: PlusColumn[] = [
    {
      label: "业务id",
      prop: "businessId",
      valueType: "copy"
    }
  ];

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
      valueType: "select",
      options: async () => {
        const { data } = await getUserByRoleIdNoPage({ role: 1044 });
        let customerList = [];
        for (let i = 0; i < data.length; i++) {
          customerList.push({
            value: data[i].id,
            label: data[i].username
          });
        }
        return customerList;
      },
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "特性名称",
      prop: "featuresIdArray",
      valueType: "select",
      options: async () => {
        const { data } = await getFeatureSelect();
        return data;
      },
      fieldProps: {
        multiple: true,
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
      label: "授权时长（天）",
      prop: "liceTime",
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
    licenseProject
  };
}
