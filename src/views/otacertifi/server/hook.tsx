import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";

export function useServer() {
  // ----变量定义-----
  const queryForm = reactive({
    name: "",
    domain: "",
    type: "",
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
      parentId: 0,
      projName: "",
      modelName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: "",
      type: "ca",
      remark: ""
    }
  });
  const rules = reactive<FormRules>({
    projName: [{ required: true, message: "所属项目必填", trigger: "blur" }],
    modelName: [{ required: true, message: "所属模块必填", trigger: "blur" }],
    password: [{ required: true, message: "密码必填", trigger: "blur" }],
    name: [{ required: true, message: "名称必填", trigger: "blur" }],
    domain: [{ required: true, message: "域名必填", trigger: "blur" }],
    expiryData: [{ required: true, message: "失效时间必填", trigger: "change" }]
  });

  const moreCondition = ref(false);

  // 状态类型
  const status = ref([
    {
      value: "未生效",
      label: "未生效"
    },
    {
      value: "已使用",
      label: "已使用"
    },
    {
      value: "已废弃",
      label: "已废弃"
    }
  ]);

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
      label: "所属项目",
      prop: "projName",
      minWidth: 100
    },
    {
      label: "所属模块",
      prop: "modelName",
      minWidth: 100
    },
    {
      label: "CA名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "状态值",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "已使用"
              ? "success"
              : row.status === "未生效"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "失效期限",
      minWidth: 180,
      prop: "expiryData"
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
  function handleUpdate(row, formEl) {
    console.log(row);
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);
    openDia("修改", formEl);
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
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  async function onSearch() {
    console.log("onSearch");
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };
  const restartForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    cancel();
    onSearch();
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      parentId: 0,
      projName: "",
      modelName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: "",
      type: "ca",
      remark: ""
    };

    queryForm.name = "";
    queryForm.domain = "";
    queryForm.type = "";
    queryForm.status = "";
    dialogFormVisible.value = false;
    onSearch();
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    console.log("submitForm", formEl);
  };
  // 打开弹框
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
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
    moreCondition,
    columns,
    status,
    buttonClass,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
