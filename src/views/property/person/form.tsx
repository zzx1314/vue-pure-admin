// form表单
import type { PlusColumn } from "plus-pro-components";
import { getUserByRoleIdNoPage } from "@/api/user";

export function useCollectorBusDevForm() {
  const columnsDialogUser: PlusColumn[] = [
    {
      label: "用户名",
      prop: "userId",
      valueType: "select",
      options: async () => {
        const { data } = await getUserByRoleIdNoPage({ role: 1054 });
        let userList = [];
        for (let i = 0; i < data.length; i++) {
          userList.push({
            value: data[i].id,
            label: data[i].username
          });
        }
        return userList;
      },
      fieldProps: {
        filterable: true
      }
    }
  ];
  const columnsForm: PlusColumn[] = [
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
    },
    {
      label: "拥有者",
      prop: "username",
      valueType: "copy",
      fieldProps: {
        disabled: true
      }
    },
    {
      label: "签名",
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
        span: 5,
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
        span: 5,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "资产编号",
      prop: "propertyNumber",
      valueType: "copy",
      colProps: {
        span: 5,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    },
    {
      label: "类型",
      prop: "propertyType",
      valueType: "select",
      options: [
        {
          value: "official",
          label: "办公资产"
        },
        {
          value: "fix",
          label: "固定资产"
        }
      ],
      colProps: {
        span: 5,
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
        span: 5
      }
    },
    {
      label: "结束时间",
      prop: "endTime",
      valueType: "date-picker",
      fieldProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD"
      },
      colProps: {
        span: 5,
        "padding-left": "0px",
        "padding-right": "0px"
      }
    }
  ];
  return {
    columnsForm,
    columnsQueryForm,
    columnsDialogUser
  };
}
