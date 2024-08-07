import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { FormInstance, FormRules } from "element-plus";
import { taskDelete, taskPage, taskUpdate } from "@/api/otaTask";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useTask() {
  // ----变量定义-----
  const queryForm = reactive({
    taskName: "",
    taskType: "",
    status: ""
  });
  const dataList = ref([]);
  const devDataList = ref([]);
  const resDataList = ref([]);
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
      taskName: "",
      taskType: "",
      status: ""
    }
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "角色名称必填", trigger: "blur" }],
    code: [{ required: true, message: "角色编码必填", trigger: "blur" }]
  });
  const devClumns: TableColumnList = [
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
      label: "设备Ip",
      prop: "devIp",
      minWidth: 100
    },
    {
      label: "设备Id",
      prop: "otaDevId",
      minWidth: 100
    },
    {
      label: "任务状态",
      prop: "status",
      minWidth: 100
    },
    {
      label: "类型",
      prop: "status",
      minWidth: 100
    },
    {
      label: "组别",
      prop: "status",
      minWidth: 100
    }
  ];
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
      label: "任务名称",
      prop: "taskName",
      minWidth: 100
    },
    {
      label: "任务类型",
      prop: "taskType",
      minWidth: 120,
      cellRenderer: ({ row }) => <el-tag type="success">{row.taskType}</el-tag>
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "开始执行时间",
      minWidth: 180,
      prop: "startTime"
    },
    {
      label: "任务结束时间",
      minWidth: 180,
      prop: "finishTime"
    },
    {
      label: "状态值",
      minWidth: 100,
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={row.status === "完成" ? "success" : "primary"}>
          {row.status}
        </el-tag>
      )
    },
    {
      label: "设备ID",
      minWidth: 180,
      prop: "otaDevId"
    },
    {
      label: "资源名称",
      minWidth: 180,
      prop: "resName"
    },
    {
      label: "操作人",
      minWidth: 150,
      prop: "operator"
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
  function handleDesc(row, formEl) {
    console.log(row);
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);

    resDataList.value = ["资源1", "资源2", "资源3"];
    openDia("查看详情", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    taskDelete(row.id).then(res => {
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

  function handleDevSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleDevCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleDevSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    console.log("查询信息");
    const { data } = await taskPage(queryForm);
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
      taskName: "",
      taskType: "",
      status: ""
    };
    queryForm.taskName = "";
    queryForm.taskType = "";
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
          console.log("修改任务");
          taskUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel();
            } else {
              message("修改失败！", { type: "error" });
            }
          });
        } else {
          // 新增
          console.log("新增任务");
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  // 打开弹框
  function openDia(param, formEl) {
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
    devDataList,
    loading,
    dialogFormVisible,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    devClumns,
    resDataList,
    onSearch,
    resetForm,
    handleDesc,
    handleDelete,
    handleSizeChange,
    handleDevSizeChange,
    handleCurrentChange,
    handleDevCurrentChange,
    handleSelectionChange,
    handleDevSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
