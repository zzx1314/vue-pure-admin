import { ref } from "vue";
// @ts-ignore
import { getMenuData } from "@/api/system";

export function sysAuth() {
  interface SysRoleType {
    code: string;
    label: string;
    children?: SysRoleType[];
  }

  const defaultProps = {
    children: "children",
    label: "label"
  };

  const sysMenuTitleVoData = ref([]);

  const activeNames = ref([]);

  const roleData: SysRoleType[] = [
    {
      code: "110",
      label: "系统管理员"
    },
    {
      code: "101",
      label: "设备管理员"
    },
    {
      code: "011",
      label: "发布人员"
    }
  ];

  const value = ref("");

  const options = [
    {
      value: "权限1",
      label: "权限1"
    },
    {
      value: "权限2",
      label: "权限2"
    }
  ];

  /** 点击角色 */
  const handleNodeClick = (data: SysRoleType) => {
    console.log(data.code);
    getAuthAll(data.code);
  };

  /** 点击全部 */
  const handleCheckAllChange = (id: number, val: boolean) => {
    console.log(val);
    const allUse = [];
    for (const val of sysMenuTitleVoData.value) {
      // 判断groupId
      if (val.id == id) {
        val.useAuthList = val.isCheckAll
          ? val.authList.map(item => item.id)
          : [];
      }
      allUse.push(...val.useAuthList);
    }
    console.log("useAuth", allUse);
  };

  /** 选中 */
  const setCheck = (value: number) => {
    const allUse = [];
    for (const val of sysMenuTitleVoData.value) {
      if (val.id == value) {
        // 判断已经选中的列表是否和选项列表数量一致，如果一致为true，否则为false
        val.isCheckAll =
          val.authList.length == val.useAuthList.length ? true : false;
      }
      allUse.push(...val.useAuthList);
    }

    console.log("useAuth", allUse);
  };

  async function getAuthAll(code) {
    const { data } = await getMenuData(code);
    sysMenuTitleVoData.value = data;
    activeNames.value = data.map(one => one.id);
    console.log(sysMenuTitleVoData.value);
  }

  return {
    sysMenuTitleVoData,
    roleData,
    defaultProps,
    value,
    options,
    activeNames,
    handleNodeClick,
    handleCheckAllChange,
    setCheck
  };
}
