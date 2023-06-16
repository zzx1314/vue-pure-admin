import { deleteRole, getRoleList, saveRole, updateRole } from "@/api/system";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";
import { FormRules, FormInstance } from "element-plus";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useRole() {
  // ----变量定义-----
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const title = ref("");
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      name: "",
      code: "",
      status: "",
      description: ""
    }
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "角色名称必填", trigger: "blur" }],
    code: [{ required: true, message: "角色编码必填", trigger: "blur" }]
  });
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "角色编号",
      prop: "code",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色描述",
      prop: "description",
      minWidth: 150
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
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
  // 修改
  function handleUpdate(row) {
    console.log(row);
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);
    openDia("修改角色");
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    deleteRole(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    const { data } = await getRoleList();
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  // 取消
  function cancel(formEl) {
    addForm.value = {
      id: null,
      name: "",
      code: "",
      status: "",
      description: ""
    };
    resetForm(formEl);
    dialogFormVisible.value = false;
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        if (addForm.value.id) {
          // 修改
          updateRole(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              onSearch();
              cancel(formEl);
            } else {
              message(res.msg, { type: "error" });
            }
          });
        } else {
          // 新增
          saveRole(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("添加成功！", { type: "success" });
              onSearch();
              cancel(formEl);
            } else {
              message("添加失败！", { type: "error" });
            }
          });
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  // 打开弹框
  function openDia(param) {
    dialogFormVisible.value = true;
    title.value = param;
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    dialogFormVisible,
    title,
    addForm,
    rules,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    submitForm,
    openDia
  };
}
