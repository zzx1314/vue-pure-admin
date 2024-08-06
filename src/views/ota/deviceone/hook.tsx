import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";

export function useDevice() {
  // ----变量定义-----
  const queryForm = reactive({
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
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "设备id",
      prop: "devId",
      minWidth: 100
    },
    {
      label: "状态值",
      prop: "status",
      minWidth: 120
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
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
    openDia("修改资源");
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
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
    console.log("查询资源信息");
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
          console.log("修改修改设备");
        } else {
          // 新增
          console.log("新增设备信息");
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
    queryForm,
    dataList,
    loading,
    dialogFormVisible,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
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
