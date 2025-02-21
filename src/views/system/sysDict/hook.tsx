import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  getItemById,
  getDictPage,
  saveItem,
  saveDict,
  updateDict,
  deleteDictItem,
  deleteDict
} from "@/api/system";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { delObjectProperty } from "@pureadmin/utils";

export function useDictBus() {
  // ----变量定义-----
  const queryForm = ref({
    type: "",
    description: "",
    beginTime: "",
    endTime: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogItemFormVisible = ref(false);
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
    dictType: [{ required: true, message: "字典类型必填", trigger: "blur" }],
    type: [{ required: true, message: "类型必填", trigger: "change" }]
  });
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
      label: "类型",
      minWidth: 100,
      prop: "dictType"
    },
    {
      label: "字典类型",
      minWidth: 100,
      prop: "type"
    },
    {
      label: "字典描述",
      minWidth: 100,
      prop: "description"
    },
    {
      label: "创建时间",
      minWidth: 100,
      prop: "createTime"
    },
    {
      label: "备注",
      minWidth: 100,
      prop: "remark"
    },
    {
      label: "操作",
      fixed: "right",
      width: 250,
      slot: "operation"
    }
  ];

  const columnsItem: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "字典类型",
      minWidth: 100,
      prop: "type",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.type} />
          ) : (
            <p>{row.type}</p>
          )}
        </>
      )
    },
    {
      label: "标签",
      minWidth: 100,
      prop: "label",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.label} />
          ) : (
            <p>{row.label}</p>
          )}
        </>
      )
    },
    {
      label: "数据值",
      minWidth: 100,
      prop: "value",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.value} />
          ) : (
            <p>{row.value}</p>
          )}
        </>
      )
    },
    {
      label: "字典描述",
      minWidth: 100,
      prop: "description",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.description} />
          ) : (
            <p>{row.description}</p>
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
    deleteDict(row.id).then(res => {
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
    console.log("查询信息", queryForm);
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
    const { data } = await getDictPage(query);
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
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      collectorId: "",
      collectorIp: "",
      remark: ""
    };
    queryForm.value.type = "";
    queryForm.value.description = "";
    queryForm.value.beginTime = "";
    queryForm.value.endTime = "";
    dialogFormVisible.value = false;
    onSearch();
  }
  // 提交
  const handleSubmit = (values: FieldValues) => {
    console.log(values, "Submit");
    if (addForm.value.id) {
      // 修改
      console.log("修改");
      updateDict(addForm.value).then(res => {
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
      saveDict(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("保存成功！", { type: "success" });
          cancel();
        } else {
          message(res.msg, { type: "error" });
        }
      });
    }
  };
  // 提交错误
  const handleSubmitError = (err: any) => {
    console.log(err, "err");
  };
  // 打开弹框
  function openDia(param, formEl) {
    console.log("formEl", formEl);
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }
  // 打开字典项弹框
  async function openSetDia(param) {
    console.log(param);
    dialogItemFormVisible.value = true;
    editRow.value = param;
    const { data } = await getItemById(param.id);
    dataListMode.value = data;
  }
  // 新增一行
  function onAdd() {
    dataListMode.value.push({
      id: null,
      dictId: editRow.value.id,
      sort: dataListMode.value.length + 1,
      type: "",
      label: "",
      value: "",
      description: "",
      remark: ""
    });
    onEdit(
      dataListMode.value[dataListMode.value.length - 1],
      dataListMode.value.length - 1
    );
  }
  // 修改
  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
    console.log(editMap.value[index]);
  }
  // 保存
  function onSave(index) {
    editMap.value[index].editable = false;
    if (!dataListMode.value[index].type && !dataListMode.value[index].label) {
      message("类型和标签不能为空！", { type: "error" });
      return;
    }
    saveItem(dataListMode.value[index]).then(res => {
      if (res.code === SUCCESS) {
        message("新增成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  // 取消
  function onCancel(index) {
    editMap.value[index].editable = false;
    dataListMode.value[index] = delObjectProperty(
      editMap.value[index],
      "editable"
    );
  }
  // 删除
  function onDel(row) {
    const index = dataListMode.value.indexOf(row);
    if (index !== -1) dataListMode.value.splice(index, 1);
    deleteDictItem(row.id).then(res => {
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
    dialogItemFormVisible,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    columnsItem,
    dataListMode,
    editMap,
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleUpdate,
    cancel,
    handleSubmit,
    handleSubmitError,
    openDia,
    openSetDia,
    onAdd,
    onEdit,
    onSave,
    onCancel,
    onDel
  };
}
