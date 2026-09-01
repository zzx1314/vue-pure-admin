import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";
import { prodDelete, prodPage, prodSave, prodUpdate } from "@/api/cerFeatures";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { getUserByRoleIdNoPage } from "@/api/user";
import { maxUtf8BytesRule } from "@/utils/byteLength";

export function useProd() {
  // ----变量定义-----
  const queryForm = reactive({
    featuresName: "",
    featuresVersion: "",
    modeInfo: "",
    endTime: "",
    beginTime: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogModeFormVisible = ref(false);
  const title = ref("");

  const editMap = ref({});
  const dataListMode = ref([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      featuresName: "",
      featuresVersion: "",
      modeInfo: "",
      remark: "",
      supplierId: null
    }
  });
  // 所属供应商下拉（中间商账号，role=1045）
  const supplierList = ref([]);
  const rules = reactive<FormRules>({
    featuresName: [
      { required: true, message: "特性名称必填", trigger: "blur" },
      {
        pattern: /^[a-zA-Z\s]+$/,
        message: "特性名称必须是英文",
        trigger: "blur"
      },
      maxUtf8BytesRule("特性名称")
    ],
    featuresVersion: [
      { required: true, message: "特性版本必填", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: "特性版本只能是英文,数字，下划线",
        trigger: "blur"
      }
    ]
  });

  const moreCondition = ref(false);

  // 状态类型
  const status = ref([
    {
      value: "未生效",
      label: "未生效"
    },
    {
      value: "已使用",
      label: "已使用"
    },
    {
      value: "已废弃",
      label: "已废弃"
    }
  ]);

  const columns: TableColumnList = [
    {
      type: "selection",
      label: "勾选列",
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
      label: "特性名称",
      prop: "featuresName",
      minWidth: 100
    },
    /*{
      label: "特性版本",
      prop: "featuresVersion",
      minWidth: 100
    },*/
    {
      label: "所属供应商",
      prop: "supplierName",
      minWidth: 100
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
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
    prodDelete(row.id).then(res => {
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

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    console.log("查询特性信息");
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
    const { data } = await prodPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    dataList.value = groupProds(dataList.value);
    console.log("dataList", dataList.value);
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
      featuresName: "",
      featuresVersion: "",
      modeInfo: "",
      remark: "",
      supplierId: null
    };
    queryForm.featuresName = "";
    queryForm.featuresVersion = "";
    queryForm.modeInfo = "";
    queryForm.beginTime = "";
    queryForm.endTime = "";
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
          console.log("修改特性信息");
          prodUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        } else {
          // 新增
          console.log("新增信息");
          prodSave(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("保存成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  // 打开弹框
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
    getSupplierList();
  }
  // 获取所属供应商下拉数据（中间商账号，role=1045）
  function getSupplierList() {
    getUserByRoleIdNoPage({ role: 1045 }).then(res => {
      supplierList.value = (res.data || []).map(item => ({
        value: item.id,
        label: item.username
      }));
    });
  }

  const groupProds = prods => {
    const groupedProds = [];
    let currentName = "";
    let rowCount = 0;

    prods.forEach(prod => {
      if (prod.featuresName !== currentName) {
        currentName = prod.featuresName;
        rowCount = 1;
        groupedProds.push({ ...prod, rowspan: 1 });
      } else {
        rowCount++;
        groupedProds[groupedProds.length - 1].rowspan = rowCount;
        groupedProds.push({ ...prod, rowspan: 0 });
      }
    });
    return groupedProds;
  };
  const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    console.log(row, column, rowIndex, columnIndex);
    if (columnIndex === 2) {
      return {
        rowspan: row.rowspan,
        colspan: 1
      };
    }
    return {
      rowspan: 1,
      colspan: 1
    };
  };

  onMounted(() => {
    onSearch();
  });

  return {
    queryForm,
    dataList,
    editMap,
    dataListMode,
    loading,
    dialogFormVisible,
    dialogModeFormVisible,
    title,
    pagination,
    addForm,
    supplierList,
    rules,
    moreCondition,
    columns,
    status,
    buttonClass,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia,
    groupProds,
    objectSpanMethod
  };
}
