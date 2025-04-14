import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  actThProcessConfSave,
  actThProcessConfPage,
  actThProcessConfUpdate,
  actThProcessConfDelete,
  actThProcessConfGetProcessPage,
  actThProcessDeleteProcess
} from "@/api/actThProcessConf";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";

export function useActThProcessConf() {
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
  const dialogFormVisible = ref(false);
  const title = ref("");
  const dialogDesignVisible = ref(false);
  const dialogViewHistory = ref(false);
  const currentRow = ref();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const paginationHistory = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref({
    id: null
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "名称必填", trigger: "blur" }]
  });
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
      fixed: "left",
      width: 70
    },
    {
      label: "配置名称",
      prop: "name",
      width: 150
    },
    {
      label: "流程ID",
      prop: "bpmnId",
      width: 190,
      cellRenderer: ({ row }) => (
        <el-button
          link
          primary
          type="primary"
          onClick={() => {
            console.log(row);
            dialogViewHistory.value = true;
            currentRow.value = row;
            onSearchHistory(row.bpmnId);
          }}
        >
          {row.bpmnId}
        </el-button>
      )
    },
    {
      label: "流程版本",
      prop: "bpmnVersion",
      width: 100
    },
    {
      label: "流程状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "已激活"
              ? "success"
              : row.status === "待绑定"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "业务类型",
      prop: "businessType",
      width: 120
    },
    {
      label: "备注",
      prop: "remark",
      width: 150
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 160
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const historyColumns: TableColumnList = [
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
      fixed: "left",
      width: 70
    },
    {
      label: "流程名称",
      prop: "processName",
      width: 150
    },
    {
      label: "流程ID",
      prop: "bpmnId",
      width: 190
    },
    {
      label: "流程版本",
      prop: "version",
      width: 100
    },
    {
      label: "流程状态",
      prop: "isExpire",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.isExpire === 0 ? "success" : "danger"}>
          {row.isExpire === 0 ? "已激活" : "已过期"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 160
    },
    {
      label: "操作",
      fixed: "right",
      minWidth: 180,
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
  function handleUpdate(row, formEl) {
    console.log(row);
    const data = JSON.stringify(row);
    addForm.value = JSON.parse(data);
    openDia("修改配置", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    actThProcessConfDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  // 删除历史
  function handleDeleteHistory(row) {
    console.log(row);
    actThProcessDeleteProcess(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearchHistory(currentRow.value.bpmnId);
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
    paginationHistory.pageSize = val;
    onSearchHistory(currentRow.value.bpmnId);
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handleCurrentChangeHistory(val: number) {
    paginationHistory.currentPage = val;
    onSearchHistory(currentRow.value.bpmnId);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleSelectionChangeHistory(val) {
    console.log("handleSelectionChange", val);
  }

  const handleSubmitError = (err: any) => {
    console.log(err, "err");
  };

  // 保存
  const handleSubmit = (values: FieldValues) => {
    console.log(values, "Submit");
    if (addForm.value.id) {
      // 修改
      console.log("修改");
      actThProcessConfUpdate(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("修改成功！", { type: "success" });
          cancel();
        } else {
          message("修改失败！", { type: "error" });
        }
      });
    } else {
      // 新增
      console.log("新增");
      actThProcessConfSave(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("保存成功！", { type: "success" });
          cancel();
        } else {
          message(res.msg, { type: "error" });
        }
      });
    }
  };

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
    const { data } = await actThProcessConfPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearchHistory(bpmnId) {
    loading.value = true;
    console.log("查询信息");
    const page = {
      size: paginationHistory.pageSize,
      current: paginationHistory.currentPage
    };
    const query = {
      ...page,
      ...queryForm.value,
      bpmnId: bpmnId
    };
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await actThProcessConfGetProcessPage(query);
    dataListHistory.value = data.records;
    paginationHistory.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.formInstance.clearValidate();
      console.log("resetForm");
    });
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
    dialogFormVisible.value = false;
    dialogViewHistory.value = false;
    onSearch();
  }
  // 打开弹框
  function openDia(param, formEl) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }

  function setBpmn(row) {
    console.log(row);
    dialogDesignVisible.value = true;
    console.log(dialogDesignVisible.value);
    currentRow.value = row;
  }

  function closeDesign() {
    dialogDesignVisible.value = false;
    cancel();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    queryForm,
    dataList,
    dataListHistory,
    loading,
    dialogFormVisible,
    title,
    pagination,
    paginationHistory,
    addForm,
    rules,
    columns,
    historyColumns,
    buttonClass,
    moreCondition,
    dialogDesignVisible,
    dialogViewHistory,
    currentRow,
    onSearch,
    onSearchHistory,
    resetForm,
    handleUpdate,
    handleDelete,
    handleDeleteHistory,
    handleSizeChange,
    handleSizeChangeHistory,
    handleCurrentChange,
    handleCurrentChangeHistory,
    handleSelectionChange,
    handleSelectionChangeHistory,
    handleSubmit,
    handleSubmitError,
    cancel,
    restartForm,
    openDia,
    setBpmn,
    closeDesign
  };
}
