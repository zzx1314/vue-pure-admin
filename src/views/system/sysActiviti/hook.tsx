import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { Ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  actThTaskSave,
  actThTaskPage,
  actThTaskUpdate,
  actThTaskDelete,
  actThTaskGetProcessInstanceId,
  actThTaskGetHistoryApprovalOpinion,
  actThTaskGetNextNode
} from "@/api/actThTask";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues, OptionsRow, PlusColumn } from "plus-pro-components";
export function useActThTask() {
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
  const dialogViewBpmn = ref(false);
  const dialogViewBpmnApprove = ref(false);
  const title = ref("");
  const bpmnXmlStr = ref("");
  const historyNodeIds = ref([]);
  const currentNodeIds = ref([]);
  const approyData = ref({});
  const licenseProjectData = ref(null);
  const isShowApproy = ref(false);

  const columnsApproyForm: PlusColumn[] = [
    {
      label: "审批人",
      width: 120,
      prop: "approverId",
      hideInForm: computed(() => {
        return !isShowApproy.value;
      }),
      valueType: "select",
      options: computed(() => {
        return options.value;
      })
    },
    {
      label: "审批意见",
      width: 120,
      prop: "content",
      valueType: "textarea"
    },
    {
      label: "审批状态",
      width: 120,
      prop: "status",
      valueType: "select",
      options: [
        {
          label: "驳回",
          value: "驳回",
          color: "red"
        },
        {
          label: "通过",
          value: "通过",
          color: "blue"
        }
      ]
    }
  ];

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

  const options: Ref<OptionsRow[]> = ref([]);

  const historyApproyColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      width: 70
    },
    {
      label: "审批人",
      prop: "operator",
      width: 100
    },
    {
      label: "审批时间",
      prop: "createTime",
      minWidth: 160
    },
    {
      label: "审批结果",
      prop: "operatorStep",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.operatorStep === 4 ? "danger" : "success"}>
          {row.operatorStep === 4
            ? "驳回"
            : row.operatorStep === 1
              ? "提交"
              : "通过"}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "remark",
      width: 200
    }
  ];
  const historyApproyData = ref([]);
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
      prop: "applyPerName",
      width: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 180
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
      label: "备注",
      prop: "remark",
      width: 200
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
    actThTaskDelete(row.id).then(res => {
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

  const submitApproy = () => {
    console.log(approyData.value);
  };
  function handleApprover(row) {
    console.log(row);
    if (row.businessServiceChange) {
      let data = JSON.parse(row.businessServiceChange);
      licenseProjectData.value = data.filed;
    }
    actThTaskGetHistoryApprovalOpinion(row.businessId, row.businessType).then(
      res => {
        if (res.code === SUCCESS) {
          console.log(res.data);
          historyApproyData.value = res.data;
        } else {
          message(res.msg, { type: "error" });
        }
      }
    );
    actThTaskGetNextNode(row.id).then(res => {
      if (res.code === SUCCESS) {
        if (res.data.useInfo && res.data.useInfo.length > 0) {
          options.value = res.data.useInfo;
          isShowApproy.value = true;
        }
      }
    });
    dialogViewBpmnApprove.value = true;
  }

  // 保存
  const handleSubmit = (values: FieldValues) => {
    console.log(values, "Submit");
    if (addForm.value.id) {
      // 修改
      console.log("修改");
      actThTaskUpdate(addForm.value).then(res => {
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
      actThTaskSave(addForm.value).then(res => {
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
    const { data } = await actThTaskPage(query);
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
    dialogViewBpmnApprove.value = false;
    onSearch();
  }
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
    loading,
    dialogFormVisible,
    dialogViewBpmn,
    dialogViewBpmnApprove,
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
    historyApproyColumns,
    historyApproyData,
    approyData,
    licenseProjectData,
    columnsApproyForm,
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
    handleApprover,
    cancel,
    restartForm,
    openDia,
    submitApproy
  };
}
