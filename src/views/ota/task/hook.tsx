import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";
import {
  taskDelete,
  taskPage,
  taskUpdate,
  taskGetById,
  downLog
} from "@/api/otaTask";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useTask() {
  // ----变量定义-----
  const queryForm = reactive({
    taskName: "",
    taskType: "",
    status: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const devDataList = ref([]);
  const resDataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogStatusVisible = ref(false);
  const activStatus = ref();
  const title = ref("");
  const detailTaskId = ref<number | null>(null);

  const step1 = ref("安装包制作");
  const step2 = ref("待下发");
  const step3 = ref("接受任务");
  const step4 = ref("下载成功");
  const step5 = ref("升级成功");
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
      align: "left",
      fixed: "left",
      label: "勾选列"
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
    },
    {
      label: "设备Ip",
      prop: "devIp",
      minWidth: 100
    },
    {
      label: "设备Id",
      prop: "devId",
      minWidth: 100
    },
    {
      label: "任务状态",
      prop: "status",
      minWidth: 100,
      slot: "status"
    },
    {
      label: "设备类型",
      prop: "type",
      minWidth: 100
    },
    {
      label: "设备组别",
      prop: "devGroup",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left",
      label: "勾选列"
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
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
      label: "任务状态",
      minWidth: 100,
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={row.status === "已完成" ? "success" : "primary"}>
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
  // 查询任务详情，供打开详情和详情列表刷新复用
  async function loadTaskDetail(taskId: number) {
    const res = await taskGetById(taskId);
    if (res.code === SUCCESS) {
      devDataList.value = res.data.otaBusTaskDevList || [];
      resDataList.value = res.data.otaResList || [];
      return true;
    }
    message(res.msg || "查询任务详情失败", { type: "error" });
    return false;
  }

  // 修改
  async function handleDesc(row, formEl) {
    console.log(row);
    detailTaskId.value = row.id;
    await loadTaskDetail(row.id);
    openDia("查看详情", formEl);
  }

  // 刷新详情中的下发设备列表
  async function refreshTaskDetail() {
    if (detailTaskId.value == null) return;
    await loadTaskDetail(detailTaskId.value);
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
    pagination.pageSize = val;
    onSearch();
  }

  function handleDevSizeChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleDevCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleDevSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleDown(row) {
    console.log("下载", row);
    if (row.logFileName) {
      downLog(row);
    } else {
      message("暂无日志文件！", { type: "error" });
    }
  }
  function handleShowStatus(row) {
    console.log("查看状态", row);
    dialogStatusVisible.value = true;
    activStatus.value = row.status;
    if (row.status === "下载失败") {
      step4.value = "下载失败";
    } else {
      step4.value = "下载成功";
    }
    if (row.status === "升级失败") {
      step5.value = "升级失败";
    } else {
      step5.value = "升级成功";
    }
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    console.log("查询信息");
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm
    };
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await taskPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.clearValidate();
  };

  const restartForm = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.resetFields();
      cancel();
    });
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
    queryForm.beginTime = "";
    queryForm.endTime = "";
    dialogFormVisible.value = false;
    detailTaskId.value = null;
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
    dialogStatusVisible,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    devClumns,
    resDataList,
    moreCondition,
    activStatus,
    step1,
    step2,
    step3,
    step4,
    step5,
    onSearch,
    resetForm,
    handleDesc,
    refreshTaskDetail,
    handleDelete,
    handleSizeChange,
    handleDevSizeChange,
    handleCurrentChange,
    handleDevCurrentChange,
    handleSelectionChange,
    handleDevSelectionChange,
    handleDown,
    handleShowStatus,
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
