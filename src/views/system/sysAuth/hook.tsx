import { onMounted, ref } from "vue";
// @ts-ignore
import { getMenuData, listAllRole, setMenuAuth } from "@/api/system";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function sysAuth() {
  const defaultProps = {
    children: "children",
    label: "label",
    disabled: "disabled"
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
    ElMessageBox.confirm(`确认要修改权限吗？`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }).then(() => {
      const allUse = [];
      for (const val of sysMenuTitleVoData.value) {
        // 判断groupId
        if (val.id == id) {
          if (val.isCheckAll) {
            val.useAuthList = val.authList.map(item => item.id);
          } else {
            val.useAuthList = val.authList
              .filter(item => item.disabled)
              .map(item => item.id);
          }
        }
        allUse.push(...val.useAuthList);
      }
      const params = {
        roleCode: currentRoleCode.value,
        authList: allUse
      };
      setMenuAuth(params).then(res => {
        if (res.code === SUCCESS) {
          message("权限将在下次登录生效！", { type: "success" });
        }
      });
      console.log("useAuth", allUse);
    });
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

  function getAuthAll(code) {
    getMenuData(code).then(res => {
      if (res.code === SUCCESS) {
        sysMenuTitleVoData.value = res.data;
        activeNames.value = res.data.map(one => one.id);
        console.log(sysMenuTitleVoData.value);
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  async function getAllRole() {
    const { data } = await listAllRole();
    const allCheckItem = ref([]);
    data.map(item => {
      allCheckItem.value.push({
        id: item.id,
        label: item.name,
        code: item.code,
        disabled: true
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
