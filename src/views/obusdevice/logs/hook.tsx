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
    name: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const dataListHistory = ref([]);
  const loading = ref(true);
  const dialogHistoryLogVisible = ref(false);
  const title = ref("");

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
    downLog(row.id);
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
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await historyLogPage(query);
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
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null
    };
    queryForm.value.name = "";
    queryForm.value.beginTime = "";
    queryForm.value.endTime = "";
    dialogHistoryLogVisible.value = false;
    onSearch();
  }
  // 打开弹框
  function openDia(param) {
    console.log(param);
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
    buttonClass,
    moreCondition,
    dialogHistoryLogVisible,
    onSearch,
    onSearchHistory,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleSizeChangeHistory,
    handleCurrentChange,
    handleCurrentChangeHistory,
    handleSelectionChange,
    handleSelectionChangeHistory,
    handleDialogClosed,
    handleDownloadLog,
    cancel,
    restartForm,
    openDia
  };
}
