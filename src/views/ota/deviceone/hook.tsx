import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { FormInstance, FormRules } from "element-plus";
import { devDelete, devPage, devSave, devUpdate } from "@/api/otaDev";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useDevice() {
  // ----变量定义-----
  const queryForm = reactive({
    devId: "",
    devIp: "",
    type: "",
    devGroup: "",
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
      devId: "",
      devIp: "",
      type: "",
      versionInfo: "",
      devGroup: "",
      remark: ""
    }
  });
  const rules = reactive<FormRules>({
    devId: [{ required: true, message: "设备ip必填", trigger: "blur" }],
    devIp: [{ required: true, message: "设备ip必填", trigger: "blur" }],
    type: [{ required: true, message: "设备类型必填", trigger: "blur" }],
    versionInfo: [{ required: true, message: "版本信息必填", trigger: "blur" }],
    devGroup: [{ required: true, message: "组别必填", trigger: "blur" }]
  });

  const moreCondition = ref(false);

  // 状态类型
  const status = ref([
    {
      value: "在线",
      label: "在线"
    },
    {
      value: "离线",
      label: "离线"
    },
    {
      value: "故障",
      label: "故障"
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
      label: "设备ID",
      prop: "devId",
      minWidth: 100
    },
    {
      label: "设备IP",
      prop: "devIp",
      minWidth: 100
    },
    {
      label: "状态值",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "在线"
              ? "success"
              : row.status === "离线"
              ? "warning"
              : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
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
      label: "组别",
      minWidth: 150,
      prop: "devGroup"
    },
    {
      label: "版本信息",
      minWidth: 180,
      prop: "versionInfo"
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
    openDia("修改资源", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    devDelete(row.id).then(res => {
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
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    console.log("查询资源信息");
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm
    };
    const { data } = await devPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
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
      devId: "",
      devIp: "",
      type: "",
      versionInfo: "",
      devGroup: "",
      remark: ""
    };

    queryForm.devIp = "";
    queryForm.devId = "";
    queryForm.devGroup = "";
    queryForm.type = "";
    queryForm.status = "";
    dialogFormVisible.value = false;
    onSearch();
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
          devUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        } else {
          // 新增
          console.log("新增设备信息");
          devSave(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("保存成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        }
      } else {
        console.log("error submit!", fields);
      }
    });
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
