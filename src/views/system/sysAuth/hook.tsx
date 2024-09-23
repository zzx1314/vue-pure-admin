import { onMounted, ref } from "vue";
// @ts-ignore
import { getMenuData, listAllRole, setMenuAuth } from "@/api/system";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function sysAuth() {
  const defaultProps = {
    children: "children",
    label: "label"
  };

  const sysMenuTitleVoData = ref([]);

  const activeNames = ref([]);

  const currentRoleCode = ref("");

  const defaultCheckedKeys = ref([]);

  const roleData = ref([]);

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
    const params = {
      roleCode: currentRoleCode.value,
      authList: allUse
    };
    setMenuAuth(params).then(res => {
      console.log(res);
    });
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
    const params = {
      roleCode: currentRoleCode.value,
      authList: allUse
    };
    setMenuAuth(params).then(res => {
      console.log(res);
      if (res.code === SUCCESS) {
        message("权限将在下次登录生效！", { type: "success" });
      }
    });
    console.log("useAuth", allUse);
  };

  async function getAuthAll(code) {
    const { data } = await getMenuData(code);
    sysMenuTitleVoData.value = data;
    activeNames.value = data.map(one => one.id);
    console.log(sysMenuTitleVoData.value);
  }

  async function getAllRole() {
    const { data } = await listAllRole();
    const allCheckItem = ref([]);
    data.map(item => {
      allCheckItem.value.push({
        id: item.id,
        label: item.name,
        code: item.code
      });
    });
    roleData.value.push(...allCheckItem.value);
    console.log("roleData", roleData);
  }
  onMounted(() => {
    getAllRole();
  });

  return {
    sysMenuTitleVoData,
    roleData,
    defaultProps,
    value,
    options,
    activeNames,
    defaultCheckedKeys,
    currentRoleCode,
    handleCheckAllChange,
    setCheck,
    getAuthAll
  };
}
