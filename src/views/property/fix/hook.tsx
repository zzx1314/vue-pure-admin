import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  propertyBusFixSave,
  propertyBusFixPage,
  propertyBusFixUpdate,
  propertyBusFixDelete,
  downloadTemplate
} from "@/api/propertyBusFix";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { importExcel } from "@/api/propertyBusOfficial";

export function usePropertyBusFix() {
  // ----变量定义-----
  const queryForm = ref({
    name: "",
    model: "",
    serialNumber: "",
    colour: "",
    deptName: "",
    propertyNumber: "",
    buyTime: "",
    useDept: "",
    useUser: "",
    useWay: "",
    remark: "",
    buyApplicant: "",
    beginTime: "",
    endTime: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const title = ref("");

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref({
    id: null,
    name: "",
    model: "",
    serialNumber: "",
    colour: "",
    deptName: "",
    propertyNumber: "",
    buyTime: "",
    price: null,
    number: null,
    sumPrice: null,
    useDept: "",
    useNumber: null,
    useTime: "",
    useUser: "",
    useWay: "",
    actualSurplus: "",
    remark: "",
    buyApplicant: ""
  });
  const countSum = (price: number, number: number) => {
    if (!price || !number) {
      return;
    }
    addForm.value.sumPrice = price * number;
  };
  const columnsForm: PlusColumn[] = [
    {
      label: "名称",
      prop: "name",
      valueType: "copy"
    },
    {
      label: "型号",
      prop: "model",
      valueType: "copy"
    },
    {
      label: "序列号",
      prop: "serialNumber",
      valueType: "copy"
    },
    {
      label: "颜色",
      prop: "colour",
      valueType: "copy"
    },
    {
      label: "单位",
      prop: "deptName",
      valueType: "copy"
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      valueType: "copy"
    },
    {
      label: "采购时间",
      prop: "buyTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      }
    },
    {
      label: "价格",
      prop: "price",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        precision: 2
      }
    },
    {
      label: "数量",
      prop: "number",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        onBlur: () => {
          console.log("onBlur");
          return countSum(addForm.value.price, addForm.value.number);
        }
      }
    },
    {
      label: "合计金额",
      prop: "sumPrice",
      valueType: "input-number",
      fieldProps: {
        min: 0,
        precision: 2
      }
    },
    {
      label: "领用部门",
      prop: "useDept",
      valueType: "copy"
    },
    {
      label: "领用数量",
      prop: "useNumber",
      valueType: "input-number"
    },
    {
      label: "领用时间",
      prop: "useTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetime",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      }
    },
    {
      label: "领用人",
      prop: "useUser",
      valueType: "copy"
    },
    {
      label: "用途",
      prop: "useWay",
      valueType: "copy"
    },
    {
      label: "实际结余",
      prop: "actualSurplus",
      valueType: "input-number"
    },
    {
      label: "备注",
      prop: "remark",
      width: "10px",
      valueType: "textarea"
    },
    {
      label: "采购申请人",
      prop: "buyApplicant",
      valueType: "copy"
    }
  ];

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
      width: 70,
      fixed: "left"
    },
    {
      label: "名称",
      prop: "name",
      minWidth: 100,
      fixed: "left"
    },
    {
      label: "型号",
      prop: "model",
      minWidth: 100,
      fixed: "left"
    },
    {
      label: "序列号",
      prop: "serialNumber",
      minWidth: 100,
      fixed: "left"
    },
    {
      label: "颜色",
      prop: "colour",
      minWidth: 100,
      fixed: "left"
    },
    {
      label: "单位",
      prop: "deptName",
      minWidth: 100,
      fixed: "left"
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      minWidth: 100
    },
    {
      label: "采购时间",
      prop: "buyTime",
      minWidth: 180
    },
    {
      label: "价格",
      prop: "price",
      minWidth: 100
    },
    {
      label: "数量",
      prop: "number",
      minWidth: 100
    },
    {
      label: "合计金额",
      prop: "sumPrice",
      minWidth: 100
    },
    {
      label: "领用部门",
      prop: "useDept",
      minWidth: 100
    },
    {
      label: "领用数量",
      prop: "useNumber",
      minWidth: 100
    },
    {
      label: "领用时间",
      prop: "useTime",
      minWidth: 180
    },
    {
      label: "领用人",
      prop: "useUser",
      minWidth: 100
    },
    {
      label: "用途",
      prop: "useWay",
      minWidth: 100
    },
    {
      label: "实际结余",
      prop: "actualSurplus",
      minWidth: 100
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 100
    },
    {
      label: "采购申请人",
      prop: "buyApplicant",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 180
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
  function handleUpdate(row, formEl) {
    console.log(row);
    const data = JSON.stringify(row);
    addForm.value = JSON.parse(data);
    openDia("修改", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    propertyBusFixDelete(row.id).then(res => {
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
      propertyBusFixUpdate(addForm.value).then(res => {
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
      propertyBusFixSave(addForm.value).then(res => {
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
    const { data } = await propertyBusFixPage(query);
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
      id: null,
      name: "",
      model: "",
      serialNumber: "",
      colour: "",
      deptName: "",
      propertyNumber: "",
      buyTime: "",
      price: null,
      number: null,
      sumPrice: null,
      useDept: "",
      useNumber: null,
      useTime: "",
      useUser: "",
      useWay: "",
      actualSurplus: "",
      remark: "",
      buyApplicant: ""
    };
    queryForm.value = {
      name: "",
      model: "",
      serialNumber: "",
      colour: "",
      deptName: "",
      propertyNumber: "",
      buyTime: "",
      useDept: "",
      useUser: "",
      useWay: "",
      remark: "",
      buyApplicant: "",
      beginTime: "",
      endTime: ""
    };
    dialogFormVisible.value = false;
    onSearch();
  }
  // 打开弹框
  function openDia(param, formEl) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }
  // 下载模板
  function handlerDownloadTemplate() {
    downloadTemplate();
  }
  // 导入数据
  function handlerImportExcel(file) {
    importExcel(file).then(res => {
      if (res.data?.code === SUCCESS) {
        message("导入成功！", { type: "success" });
        cancel();
      } else {
        message(res.data?.msg, { type: "error" });
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
    title,
    pagination,
    addForm,
    columnsForm,
    rules,
    columns,
    buttonClass,
    moreCondition,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleSubmitError,
    handlerDownloadTemplate,
    handlerImportExcel,
    cancel,
    restartForm,
    openDia
  };
}
