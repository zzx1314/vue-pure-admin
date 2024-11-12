import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  collectorBusDevSave,
  collectorBusDevPage,
  collectorBusDevUpdate,
  collectorBusDevDelete,
  collectorBusSensorUpdate,
  collectorBusSensorDelete
} from "@/api/collectorBusDev";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { delObjectProperty } from "@pureadmin/utils";

export function useCollectorBusDev() {
  // ----变量定义-----
  const queryForm = reactive({
    name: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogModeFormVisible = ref(false);
  const title = ref("");
  const dataListMode = ref([]);
  const editMap = ref({});
  const editRow = ref();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref<FieldValues>({
    id: null,
    collectorId: "",
    collectorIp: "",
    remark: ""
  });
  const rules = reactive<FormRules>({
    collectorId: [{ required: true, message: "采集器ID必填", trigger: "blur" }],
    collectorIp: [{ required: true, message: "采集器IP必填", trigger: "blur" }]
  });
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
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
      label: "采集器ID",
      minWidth: 150,
      prop: "collectorId"
    },
    {
      label: "采集器IP",
      minWidth: 150,
      prop: "collectorIp"
    },
    {
      label: "备注",
      minWidth: 200,
      prop: "remark"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const columnsSensor: TableColumnList = [
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
      label: "传感器名称",
      minWidth: 150,
      prop: "sensorName"
    },
    {
      label: "传感器ID",
      minWidth: 150,
      prop: "sensorId"
    },
    {
      label: "传感器配置",
      minWidth: 100,
      prop: "configInfoHtml",
      slot: "content",
      align: "left"
    },
    {
      label: "备注",
      minWidth: 100,
      prop: "remark"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const columnsSensorConf: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "配置名称",
      minWidth: 100,
      prop: "confName",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.confName} />
          ) : (
            <p>{row.confName}</p>
          )}
        </>
      )
    },
    {
      label: "配置值",
      minWidth: 100,
      prop: "confValue",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.confValue} />
          ) : (
            <p>{row.confValue}</p>
          )}
        </>
      )
    },
    {
      label: "备注",
      minWidth: 100,
      prop: "remark",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.remark} />
          ) : (
            <p>{row.remark}</p>
          )}
        </>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 120,
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
    collectorBusDevDelete(row.id).then(res => {
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
    const { data } = await collectorBusDevPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.formInstance.resetFields();
      console.log("resetForm");
    });
  };

  const restartForm = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.formInstance.resetFields();
      cancel();
      onSearch();
    });
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      collectorId: "",
      collectorIp: "",
      remark: ""
    };
    queryForm.beginTime = "";
    queryForm.endTime = "";
    dialogFormVisible.value = false;
    onSearch();
  }

  const handleSubmit = (values: FieldValues) => {
    debugger;
    console.log(values, "Submit");
    if (addForm.value.id) {
      // 修改
      console.log("修改");
      collectorBusDevUpdate(addForm.value).then(res => {
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
      collectorBusDevSave(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("保存成功！", { type: "success" });
          cancel();
        } else {
          message(res.msg, { type: "error" });
        }
      });
    }
  };
  const handleSubmitError = (err: any) => {
    console.log(err, "err");
  };
  const handleReset = () => {
    console.log("handleReset");
    addForm.value = {
      id: null,
      collectorId: "",
      collectorIp: "",
      remark: ""
    };
  };
  // 打开弹框
  function openDia(param, formEl) {
    console.log("formEl", formEl);
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }
  function openSetDia(param) {
    console.log(param);
    dialogModeFormVisible.value = true;
    editRow.value = param;
    if (param.config) {
      dataListMode.value = JSON.parse(param.config);
      console.log(dataListMode.value);
    }
  }

  function onAdd() {
    dataListMode.value.push({
      id: dataListMode.value.length + 1,
      confName: "",
      confValue: "",
      remark: ""
    });
    onEdit(
      dataListMode.value[dataListMode.value.length - 1],
      dataListMode.value.length - 1
    );
  }
  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
    console.log(editMap.value[index]);
  }
  function onSave(index) {
    editMap.value[index].editable = false;
    if (
      !dataListMode.value[index].confName &&
      !dataListMode.value[index].confValue
    ) {
      message("配置名称和配置值必填！", { type: "error" });
      return;
    }
    editRow.value.config = JSON.stringify(dataListMode.value);
    collectorBusSensorUpdate(editRow.value).then(res => {
      if (res.code === SUCCESS) {
        message("新增成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  function onCancel(index) {
    editMap.value[index].editable = false;
    dataListMode.value[index] = delObjectProperty(
      editMap.value[index],
      "editable"
    );
  }
  function onDel(row) {
    const index = dataListMode.value.indexOf(row);
    if (index !== -1) dataListMode.value.splice(index, 1);
    editRow.value.config = JSON.stringify(dataListMode.value);
    collectorBusSensorDelete(editRow.value).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    queryForm,
    dataList,
    loading,
    dialogFormVisible,
    dialogModeFormVisible,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    moreCondition,
    columnsSensor,
    dataListMode,
    editMap,
    columnsSensorConf,
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleUpdate,
    cancel,
    restartForm,
    handleSubmit,
    handleSubmitError,
    handleReset,
    openDia,
    openSetDia,
    onAdd,
    onEdit,
    onSave,
    onCancel,
    onDel
  };
}
