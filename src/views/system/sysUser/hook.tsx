import { message } from "@/utils/message";
import {
  userPage,
  saveUser,
  removeUserById,
  updateUser,
  userResetPwd
} from "@/api/system";
import { ElMessageBox } from "element-plus";
import { type PaginationProps, AdaptiveConfig } from "@pureadmin/table";
import { reactive, ref, computed, h } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { SUCCESS } from "@/api/base";
import { IDynamicFormRef, IDynamicFormOptions } from "@/components/ReForm/main";

import { defaultConfig } from "@/components/ReForm/IngrateArcoDesgin";
import { addDialog } from "@/components/ReDialog";
import userForm from "./userForm.vue";

import {
  IDynamicFormItemSelectValueOption,
  SimpleSelectValueFormItemRef
} from "@/components/ReForm/view/MySelect";

export function useUser() {
  // 查询动态form
  const formRef = ref<IDynamicFormRef>();
  // 添加动态form
  const addFormRef = ref<IDynamicFormRef>();
  // 更多查询条件
  const moreCondition = ref(false);
  // 性别
  const sexArray = ref([]);
  // 查询form
  const queryForm = ref({
    orgIds: null,
    realName: "",
    lockFlag: "",
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
    lockFlag: "",
    sex: "",
    role: "",
    orgId: null
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
  // 添加校验规则
  const rules = reactive<FormRules>({
    realName: [{ required: true, message: "姓名必填", trigger: "blur" }],
    username: [{ required: true, message: "账号必填", trigger: "blur" }],
    newpassword: [{ required: true, message: "密码必填", trigger: "blur" }],
    newpassword1: [{ required: true, message: "密码必填", trigger: "blur" }],
    lockFlag: [{ required: true, message: "类型必填", trigger: "change" }],
    sex: [{ required: true, message: "性别必填", trigger: "change" }],
    role: [{ required: true, message: "角色必填", trigger: "change" }]
  });
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
    {
      label: "性别",
      prop: "sex",
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
  // 动态表单
  // 动态表单-查询动态表单
  const formOptions: IDynamicFormOptions = {
    ...defaultConfig,
    formRules: {},
    formAdditionaProps: {
      inline: true
    },
    formItems: [
      {
        type: "text",
        label: "用户名",
        name: "realName",
        additionalProps: { placeholder: "请输入用户名", clearable: true }
      },
      {
        type: "my-select",
        label: "性别",
        name: "sex",
        additionalProps: { placeholder: "请选择性别" }
      },
      {
        type: "my-select",
        label: "角色",
        name: "role",
        additionalProps: { placeholder: "请选择角色" }
      },
      {
        type: "custom",
        label: "",
        name: "moreQuery"
      }
    ]
  };

  // 添加动态表单
  const addFormOptions: IDynamicFormOptions = {
    ...defaultConfig,
    formRules: {
      realName: [{ required: true, message: "姓名必填", trigger: "blur" }],
      username: [{ required: true, message: "账号必填", trigger: "blur" }],
      newpassword: [{ required: true, message: "密码必填", trigger: "blur" }],
      newpassword1: [{ required: true, message: "密码必填", trigger: "blur" }],
      lockFlag: [{ required: true, message: "类型必填", trigger: "change" }],
      sex: [{ required: true, message: "性别必填", trigger: "change" }],
      role: [{ required: true, message: "角色必填", trigger: "change" }]
    },
    formAdditionaProps: {},
    formItems: [
      {
        type: "text",
        label: "账号",
        name: "username",
        additionalProps: { placeholder: "请输入账号", clearable: true },
        colProps: { span: 12 }
      },
      {
        type: "text",
        label: "姓名",
        name: "realName",
        additionalProps: { placeholder: "请输入姓名", clearable: true },
        colProps: { span: 12 }
      },
      {
        type: "my-select",
        label: "性别",
        name: "sex",
        additionalProps: { placeholder: "请选择性别" },
        colProps: { span: 12 }
      },
      {
        type: "my-select",
        label: "状态",
        name: "lockFlag",
        additionalProps: { placeholder: "请选择状态" },
        colProps: { span: 12 }
      },
      {
        type: "my-select",
        label: "角色",
        name: "role",
        additionalProps: { placeholder: "请选择角色" },
        colProps: { span: 12 }
      },
      {
        type: "text",
        label: "部门",
        name: "orgId",
        additionalProps: { placeholder: "请选择部门" },
        colProps: { span: 12 }
      },
      {
        type: "text",
        label: "密码",
        name: "newpassword",
        additionalProps: {
          placeholder: "请输入密码",
          type: "password",
          showPassword: true
        },
        colProps: { span: 12 }
      },
      {
        type: "text",
        label: "确认密码",
        name: "newpassword1",
        additionalProps: {
          placeholder: "请输入密码",
          type: "password",
          showPassword: true
        },
        colProps: { span: 12 }
      }
    ]
  };

  // -----方法定义---
  /**
   * 动态form表单数据初始化
   */
  function onReady() {
    // 加载性别数据
    sexArray.value.push({ text: "男", value: 1 });
    sexArray.value.push({ text: "女", value: 2 });
    formRef.value
      ?.getFormItemControlRef<SimpleSelectValueFormItemRef>("sex")
      ?.setData(sexArray.value as IDynamicFormItemSelectValueOption[]);

    // 加载角色数据
    formRef.value
      ?.getFormItemControlRef<SimpleSelectValueFormItemRef>("role")
      ?.setData(roleArry.value as IDynamicFormItemSelectValueOption[]);
  }

  /**
   * 动态form表单添加加载数据
   */
  function onReadyAdd(param) {
    sexArray.value.push({ text: "男", value: 1 });
    sexArray.value.push({ text: "女", value: 2 });
    // 加载性别数据
    addFormRef.value
      ?.getFormItemControlRef<SimpleSelectValueFormItemRef>("sex")
      ?.setData(sexArray.value as IDynamicFormItemSelectValueOption[]);
    // 加载角色数据
    addFormRef.value
      ?.getFormItemControlRef<SimpleSelectValueFormItemRef>("role")
      ?.setData(param as IDynamicFormItemSelectValueOption[]);
    // 加载状态
    const lockFlag = ref([]);
    lockFlag.value.push({ text: "开启", value: 1 });
    lockFlag.value.push({ text: "关闭", value: 2 });
    addFormRef.value
      ?.getFormItemControlRef<SimpleSelectValueFormItemRef>("lockFlag")
      ?.setData(lockFlag.value as IDynamicFormItemSelectValueOption[]);
  }

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
      lockFlag: "",
      sex: "",
      role: "",
      orgId: null
    };
    resetForm();
    dialogFormVisible.value = false;
  }

  const formRefOne = ref();
  /**
   * 开启弹框
   * @param param
   */
  function openDia(param) {
    console.log("openDia", roleArry.value);
    addDialog({
      title: param,
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(userForm, {
          ref: formRefOne,
          roleArry: roleArry.value,
          addForm: addForm.value
        }),
      beforeSure: done => {
        const FormRef = formRefOne.value.getRef();

        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title.value === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }
  /**
   * 停用启用
   * @param param0
   */
  function onChange({ row, index }) {
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
  function handleUpdate(row) {
    const userInfo = JSON.stringify(row);
    console.log(row);
    openDia("修改用户");
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
        message("密码已重置", {
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

  /**
   * 动态表单查询
   */
  function queryInfo() {
    (formRef.value?.getFormRef?.() as FormInstance)
      .validate()
      .then(res => {
        console.log(res);
        onSubmit();
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * 提交查询
   */
  function onSubmit() {
    onSearch();
  }

  /**
   * 添加表单数据
   */
  function addFormInfo() {
    (addFormRef.value?.getFormRef?.() as FormInstance)
      .validate()
      .then(res => {
        console.log(res);
        addSubmit();
      })
      .catch(e => {
        console.log(e);
      });
  }
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
  function resetForm() {
    (formRef.value.getFormRef() as FormInstance).resetFields();
    (addFormRef.value.getFormRef() as FormInstance).resetFields();
    onSearch();
  }

  return {
    formRef,
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
    addFormRef,
    title,
    rules,
    roleArry,
    allCheckItem,
    defauleCheckItem,
    formOptions,
    addFormOptions,
    setOrgId,
    setOrgIds,
    cancelEvent,
    onReady,
    onReadyAdd,
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
    queryInfo,
    addFormInfo,
    adaptiveConfig
  };
}
