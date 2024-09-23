import { message } from "@/utils/message";
import {
  userPage,
  saveUser,
  removeUserById,
  updateUser,
  userResetPwd
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import type { PaginationProps, AdaptiveConfig } from "@pureadmin/table";
import { reactive, ref, computed } from "vue";
import type { FormInstance } from "element-plus";
import { SUCCESS } from "@/api/base";
import { hasAuth } from "@/router/utils";

export function useUser() {
  // 更多查询条件
  const moreCondition = ref(false);
  // 性别
  const sexArray = ref([
    { text: "男", value: "男" },
    { text: "女", value: "女" }
  ]);
  // 查询form
  const queryForm = ref({
    orgIds: null,
    username: "",
    realName: "",
    lockFlag: null,
    sex: "",
    role: null,
    beginTime: null,
    endTime: null
  });
  // 添加form表单
  const addForm = ref({
    id: null,
    username: "",
    realName: "",
    password: "",
    newpassword: "",
    newpassword1: "",
    lockFlag: null,
    sex: "",
    role: "",
    orgId: null,
    orgName: ""
  });
  // 查询结果集
  const dataList = ref([]);
  // 加载标识
  const loading = ref(true);
  // 状态开关
  const switchLoadMap = ref({});
  // 弹框标识
  const dialogFormVisible = ref(false);
  // 弹框标题
  const title = ref("");
  // 角色结果
  const roleArry = ref([]);
  const orgNameVal = ref("");
  /** 撑满内容区自适应高度相关配置 */
  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 110
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    // fixHeader: true
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  };
  // 分页参数
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 动态Table
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
    },
    {
      label: "账号",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户名称",
      prop: "realName",
      minWidth: 130
    },
    /*{
      label: "性别",
      prop: "sex",
      minWidth: 130
    },*/
    {
      label: "角色",
      prop: "roleStr",
      minWidth: 130
    },
    {
      label: "部门",
      prop: "orgName",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "enable",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.lockFlag}
          active-value={1}
          inactive-value={0}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  // 动态Table-所有选项
  const allCheckItem = ref([]);
  // 动态Table-默认选中的选项
  const defauleCheckItem = ref(["序号列", "账号", "用户名称", "性别", "部门"]);
  // 动态Table-动态列处理
  columns.map(one => {
    if (one.label && one.label != "操作") {
      allCheckItem.value.push(one.label);
      return one.label;
    }
  });
  // 计算属性按钮
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  // -----方法定义---

  /**
   * 取消事件
   */
  const cancelEvent = () => {
    console.log("cancel!");
  };

  /**
   * 取消
   */
  function cancel() {
    addForm.value = {
      id: null,
      username: "",
      realName: "",
      password: "",
      newpassword: "",
      newpassword1: "",
      lockFlag: null,
      sex: "",
      role: "",
      orgId: null,
      orgName: orgNameVal.value
    };
    queryForm.value = {
      orgIds: null,
      username: "",
      realName: "",
      lockFlag: null,
      sex: "",
      role: null,
      beginTime: null,
      endTime: null
    };
    dialogFormVisible.value = false;
    onSearch();
  }

  /**
   * 开启弹框
   * @param param
   */
  function openDia(param, formEl) {
    console.log(roleArry.value);
    dialogFormVisible.value = true;
    resetForm(formEl);
    title.value = param;
  }
  /**
   * 停用启用
   * @param param0
   */
  function onChange({ row, index }) {
    if (!hasAuth("user_stop_start")) {
      message("您没有权限操作,本次修改不生效", { type: "error" });
      onSearch();
      return;
    }
    ElMessageBox.confirm(
      `确认要<strong>${
        row.lockFlag === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const updateParam = {
          id: row.id,
          lockFlag: row.lockFlag
        };

        updateUser(updateParam).then(res => {
          if (res.code === SUCCESS) {
            switchLoadMap.value[index] = Object.assign(
              {},
              switchLoadMap.value[index],
              {
                loading: false
              }
            );
            message("已成功修改用户状态", {
              type: "success"
            });
          }
        });
      })
      .catch(() => {
        row.lockFlag === 0 ? (row.lockFlag = 1) : (row.lockFlag = 0);
      });
  }

  /**
   * 处理修改
   * @param row
   */
  function handleUpdate(row, ref) {
    const userInfo = JSON.stringify(row);
    console.log(row);
    openDia("修改用户", ref);
    addForm.value = JSON.parse(userInfo);
    // 目前是单角色，以后修改成多角色
    addForm.value.role = row.roleList[0].id;
  }

  /**
   * 重置密码
   * @param row
   */
  function resetPwd(row) {
    console.log(row);
    userResetPwd(row).then(res => {
      if (res.code === SUCCESS) {
        message("密码已重置成初始密码：Aa123456", {
          type: "success"
        });
      }
    });
  }

  /**
   * 删除
   * @param row
   */
  function handleDelete(row) {
    console.log(row);
    removeUserById(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  /**
   * 分页数据变化
   * @param val
   */
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    onSearch(queryForm.value.orgIds);
  }

  /**
   * 分页数据变化
   * @param val
   */
  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch(queryForm.value.orgIds);
  }

  /**
   * 分页数据变化
   * @param val
   */
  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  /**
   * 查询
   * @param param
   */
  async function onSearch(param?: any) {
    console.log("onSearch", param);
    loading.value = true;
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm.value
    };
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await userPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  /**
   * 设置orgId
   * @param id
   */
  function setOrgId(id) {
    console.log("setOrgId", id);
    addForm.value.orgId = id;
  }

  /**
   * 设置orgIds
   * @param ids
   */
  function setOrgIds(ids) {
    console.log("setOrgIds", ids);
    queryForm.value.orgIds = ids;
    onSearch();
  }

  function setOrgName(orgName) {
    console.log("setOrgName", orgName);
    orgNameVal.value = orgName;
    addForm.value.orgName = orgName;
  }

  /**
   * 添加表单数据
   */
  const addFormInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log("新增资源");
        addSubmit();
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  /**
   *  保存添加
   */
  function addSubmit() {
    console.log(addForm.value);
    if (addForm.value.id) {
      console.log("修改");
      updateUser(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("修改成功！", { type: "success" });
          onSearch(addForm.value.orgId);
          cancel();
        }
      });
    } else {
      const newpassword = addForm.value.newpassword;
      const newpassword1 = addForm.value.newpassword1;
      if (newpassword === newpassword1) {
        addForm.value.password = newpassword;
        saveUser(addForm.value).then(res => {
          if (res.code === SUCCESS) {
            message("添加成功！", { type: "success" });
            onSearch(addForm.value.orgId);
            cancel();
          }
        });
      } else {
        message("密码不相同，添加失败！", { type: "error" });
      }
    }
  }
  /**
   * 查询重置
   */
  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
  }

  const restartForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    cancel();
    onSearch();
  };

  return {
    moreCondition,
    sexArray,
    queryForm,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    dialogFormVisible,
    addForm,
    title,
    roleArry,
    allCheckItem,
    defauleCheckItem,
    adaptiveConfig,
    setOrgId,
    setOrgIds,
    setOrgName,
    cancelEvent,
    resetPwd,
    cancel,
    openDia,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    addFormInfo,
    restartForm
  };
}
