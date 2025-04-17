import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  actThTaskHisSave,
  actThTaskHisPage,
  actThTaskHisUpdate,
  actThTaskHisDelete
} from "@/api/actThTaskHis";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { actThTaskGetProcessInstanceId } from "@/api/actThTask";

export function useActThTaskHis() {
  // ----变量定义-----
  const queryForm = ref({
    name: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const title = ref("");

  const bpmnXmlStr = ref("");
  const historyNodeIds = ref([]);
  const currentNodeIds = ref([]);
  const dialogViewBpmn = ref(false);

  const pagination = reactive<PaginationProps>({
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
      label: "业务类型",
      prop: "businessType",
      width: 150
    },
    {
      label: "申请人",
      prop: "applyPerId",
      width: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 170
    },
    {
      label: "任务状态",
      prop: "taskState",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.taskState === "结束" ? "success" : "danger"}>
          {row.taskState}
        </el-tag>
      )
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
    actThTaskHisDelete(row.id).then(res => {
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

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
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
      actThTaskHisUpdate(addForm.value).then(res => {
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
      actThTaskHisSave(addForm.value).then(res => {
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
    const { data } = await actThTaskHisPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
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
    dialogViewBpmn.value = false;
    onSearch();
  }
  // 打开弹框
  function openDia(param, formEl) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }

  const handleSelectBpmn = row => {
    console.log(row);
    actThTaskGetProcessInstanceId(row.processInstanceId).then(res => {
      if (res.code === SUCCESS) {
        console.log(res.data);
        bpmnXmlStr.value = res.data.xmlString;
        historyNodeIds.value = res.data.hisId;
        currentNodeIds.value = res.data.currentTaskId;
        dialogViewBpmn.value = true;
      } else {
        message(res.msg, { type: "error" });
      }
    });
  };

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
    moreCondition,
    bpmnXmlStr,
    historyNodeIds,
    currentNodeIds,
    dialogViewBpmn,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleSubmitError,
    handleSelectBpmn,
    cancel,
    restartForm,
    openDia
  };
}
