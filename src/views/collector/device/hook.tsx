import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  collectorBusDevSave,
  collectorBusDevPage,
  collectorBusDevUpdate,
  collectorBusDevDelete
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
      label: "传感器配置",
      minWidth: 200,
      prop: "config"
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
  };
  // 打开弹框
  function openDia(param, formEl) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }

  function onAdd() {
    dataListMode.value.push({
      id: dataListMode.value.length + 1,
      name: ""
    });
    onEdit(
      dataListMode.value[dataListMode.value.length - 1],
      dataListMode.value.length - 1
    );
  }
  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
  }
  function onSave(index) {
    editMap.value[index].editable = false;
    if (!dataListMode.value[index].name) {
      message("名称必填！", { type: "error" });
      return;
    }
    editRow.value.modeInfo = dataListMode.value
      .map(item => item.name)
      .join(",");
    /*prodUpdate(editRow.value).then(res => {
      if (res.code === SUCCESS) {
        message("新增成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });*/
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
    editRow.value.modeInfo = dataListMode.value
      .map(item => item.name)
      .join(",");
    /*prodUpdate(editRow.value).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });*/
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
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    handleSubmit,
    handleSubmitError,
    handleReset,
    openDia,
    onAdd,
    onEdit,
    onSave,
    onCancel,
    onDel
  };
}
