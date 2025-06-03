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
      labelWidth: 80,
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
      labelWidth: 80,
      valueType: "date-picker",
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
      labelWidth: 80,
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
      prop: "useWay",
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
      fieldProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
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
      label: "结束时间",
      prop: "endTime",
      valueType: "date-picker",
      labelWidth: 80,
      fieldProps: {
        type: "date",
        valueFormat: "YYYY-MM-DD"
      },
      colProps: {
        span: 5,
        style: {
          "padding-left": "0px",
          "padding-right": "0px"
        }
      }
    }
  ];
  return {
    columnsQueryForm,
    columnsDialogUser
  };
}
