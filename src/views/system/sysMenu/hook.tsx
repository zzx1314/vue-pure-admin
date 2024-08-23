import { message } from "@/utils/message";
import { handleTree } from "@/utils/tree";
import { reactive, ref, onMounted, h } from "vue";
import {
  menuPage,
  saveSysMenu,
  updateSysMenuById,
  deleteSysMenu
} from "@/api/system";
import type { FormInstance, FormRules } from "element-plus";
import { SUCCESS } from "@/api/base";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

export function useMenu() {
  const addForm = reactive({
    value: {
      id: null,
      name: "",
      type: 1,
      component: "",
      parentId: null,
      icon: "",
      sort: 0,
      leaf: 1, // 0：false 不是，1：true 是
      parentName: "",
      pathUrl: "",
      permission: "",
      roleCode: "",
      roleCodeList: []
    }
  });

  const searchForm = reactive({
    name: ""
  });

  const dialogFormVisible = ref(false);
  const formLabelWidth = "140px";
  const title = ref("");
  const options = [
    {
      type: 1,
      name: "菜单"
    },
    {
      type: 2,
      name: "按钮"
    },
    {
      type: 3,
      name: "路由"
    }
  ];
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      minWidth: 70
    },
    {
      label: "名称",
      prop: "name",
      width: 180,
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.name}</span>
        </>
      )
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.type === 1 ? "success" : row.type === 2 ? "warning" : "info"
          }
        >
          {row.type === 1 ? "菜单" : row.type === 2 ? "按钮" : "路由"}
        </el-tag>
      )
    },
    {
      label: "组件路径",
      prop: "pathUrl",
      width: 180,
      align: "left"
    },
    {
      label: "权限标识",
      prop: "permission",
      width: 180,
      align: "left"
    },
    {
      label: "图标",
      prop: "icon",
      width: 100,
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
        </>
      )
    },
    {
      label: "角色编码",
      prop: "roleCode",
      width: 180,
      align: "left"
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  const rules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: "名称不能为空！"
      }
    ],
    type: [
      {
        required: true,
        message: "类型不能为空！"
      }
    ],
    component: [
      {
        required: true,
        message: "路径不能为空！"
      }
    ],
    icon: [
      {
        required: true,
        message: "图标不能为空！"
      }
    ],
    pathUrl: [
      {
        required: true,
        message: "文件夹名称不能为空！"
      }
    ],
    permission: [
      {
        required: true,
        message: "权限标识不能为空！"
      },
      {
        pattern: /^[a-zA-Z_]{1,}$/,
        message: "只允许字母及下划线",
        trigger: "blur"
      }
    ],
    sort: [
      {
        required: true,
        message: "排序不能为空！"
      },
      {
        pattern: /^[0-9]*$/,
        message: "只允许数字",
        trigger: "blur"
      }
    ],
    roleCodeList: [
      {
        required: true,
        message: "请选择角色！",
        trigger: "change"
      }
    ],
    leaf: [
      {
        required: true,
        message: "请选择子节点类型！"
      }
    ],
    parentId: [
      {
        required: true,
        message: "上级菜单不能为空！"
      }
    ]
  });

  // 修改
  function handleUpdate(row) {
    console.log("row", row);
    const menuInfo = JSON.stringify(row);
    openDia("修改菜单");
    addForm.value = JSON.parse(menuInfo);
    addForm.value.roleCodeList = addForm.value.roleCode.split(",");
  }

  // 确认删除
  const confirmEvent = row => {
    console.log("confirm!", row);
    deleteSysMenu(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      }
    });
  };
  // 取消
  const cancelEvent = () => {
    console.log("cancel!");
  };

  // 多选
  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 取消
  function cancel(formEl) {
    addForm.value = {
      id: null,
      name: "",
      type: 1,
      component: "",
      parentId: null,
      icon: "",
      sort: 0,
      leaf: 1, // 0：false 不是，1：true 是
      parentName: "",
      pathUrl: "",
      permission: "",
      roleCode: "",
      roleCodeList: []
    };
    resetForm(formEl);
    dialogFormVisible.value = false;
  }

  function openDia(param) {
    title.value = param;
    dialogFormVisible.value = true;
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await menuPage(searchForm);
    dataList.value = handleTree(data);
    console.log("查询结果", dataList.value);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        if (addForm.value.id) {
          updateSysMenuById(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel(formEl);
            }
          });
        } else {
          const roleCode = addForm.value.roleCodeList;
          addForm.value.roleCode = roleCode.join(",");
          saveSysMenu(addForm.value).then(res => {
            if (res.code == SUCCESS) {
              message("添加成功！", { type: "success" });
              cancel(formEl);
            }
          });
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  onMounted(() => {
    onSearch();
  });

  return {
    addForm,
    searchForm,
    dialogFormVisible,
    formLabelWidth,
    options,
    loading,
    columns,
    dataList,
    rules,
    title,
    onSearch,
    resetForm,
    cancel,
    submitForm,
    openDia,
    handleUpdate,
    handleSelectionChange,
    confirmEvent,
    cancelEvent
  };
}
