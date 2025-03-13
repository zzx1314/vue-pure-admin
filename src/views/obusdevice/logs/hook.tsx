import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  oBusLogsPage,
  oBusLogsDelete,
  historyLogPage,
  downLog
} from "@/api/oBusLogs";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useOBusLogs() {
  // ----变量定义-----
  const queryForm = ref({
    deviceId: "",
    deviceIp: "",
    os: "",
    osVersion: "",
    arch: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const dataListHistory = ref([]);
  const loading = ref(true);
  const dialogHistoryLogVisible = ref(false);
  const title = ref("");
  const currentDeviceId = ref("");
  const currentDeviceIp = ref("");

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null
    }
  });
  const rules = reactive<FormRules>({});
  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      width: 55,
      align: "left",
      fixed: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
    },
    {
      label: "设备ID",
      prop: "deviceId",
      minWidth: 100
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      minWidth: 100
    },
    {
      label: "操作系统",
      prop: "os",
      minWidth: 100
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      minWidth: 100
    },
    {
      label: "系统架构",
      prop: "arch",
      minWidth: 100
    },
    {
      label: "日志名称",
      prop: "originalFilename",
      minWidth: 100
    },
    {
      label: "日志数量",
      prop: "logNum",
      minWidth: 100,
      cellRenderer: ({ row }) => <el-tag type={"success"}>{row.logNum}</el-tag>
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  const columnsHistory: TableColumnList = [
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
      prop: "deviceId",
      minWidth: 100
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      minWidth: 100
    },
    {
      label: "操作系统",
      prop: "os",
      minWidth: 100
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      minWidth: 100
    },
    {
      label: "系统架构",
      prop: "arch",
      minWidth: 100
    },
    {
      label: "日志名称",
      prop: "originalFilename",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
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
  // 删除
  function handleDelete(row) {
    console.log(row);
    oBusLogsDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  function handleHistoryDelete(row) {
    console.log(row);
    oBusLogsDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearchHistory();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  function handleSizeChangeHistory(val: number) {
    pagination.pageSize = val;
    onSearchHistory();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleCurrentChangeHistory(val: number) {
    pagination.currentPage = val;
    onSearchHistory();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleSelectionChangeHistory(val) {
    console.log("handleSelectionChangeHistory", val);
  }

  function handleDialogClosed() {
    console.log("handleDialogClosed");
    cancel();
  }

  function handleDownloadLog(row) {
    downLog(row.id, row.originalFilename);
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
      ...queryForm.value
    };
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await oBusLogsPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearchHistory() {
    loading.value = true;
    console.log("查询信息");
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm.value
    };
    query.deviceId = currentDeviceId.value;
    query.deviceIp = currentDeviceIp.value;
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await historyLogPage(query);
    dataListHistory.value = data.records;
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
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null
    };
    queryForm.value = {
      deviceId: "",
      deviceIp: "",
      os: "",
      osVersion: "",
      arch: "",
      beginTime: "",
      endTime: ""
    };
    currentDeviceId.value = "";
    currentDeviceIp.value = "";
    dialogHistoryLogVisible.value = false;
    onSearch();
  }

  function cancelHistory() {
    queryForm.value = {
      deviceId: "",
      deviceIp: "",
      os: "",
      osVersion: "",
      arch: "",
      beginTime: "",
      endTime: ""
    };
    onSearchHistory();
  }
  // 打开弹框
  function openDia(param) {
    console.log(param);
    currentDeviceId.value = param.deviceId;
    currentDeviceIp.value = param.deviceIp;
    dialogHistoryLogVisible.value = true;
    onSearchHistory();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    queryForm,
    dataList,
    dataListHistory,
    loading,
    title,
    pagination,
    addForm,
    rules,
    columns,
    columnsHistory,
    buttonClass,
    moreCondition,
    dialogHistoryLogVisible,
    onSearch,
    onSearchHistory,
    resetForm,
    handleDelete,
    handleHistoryDelete,
    handleSizeChange,
    handleSizeChangeHistory,
    handleCurrentChange,
    handleCurrentChangeHistory,
    handleSelectionChange,
    handleSelectionChangeHistory,
    handleDialogClosed,
    handleDownloadLog,
    cancel,
    cancelHistory,
    restartForm,
    openDia
  };
}
