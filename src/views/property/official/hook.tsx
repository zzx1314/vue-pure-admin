import {computed, nextTick, onMounted, reactive, ref} from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  propertyBusOfficialSave,
  propertyBusOfficialPage,
  propertyBusOfficialUpdate,
  propertyBusOfficialDelete
} from "@/api/propertyBusOfficial";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";

export function usePropertyBusOfficial() {
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

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref({
    id: null,
    name: "",
    colour: "",
    deptName: "",
    buyNumber: "",
    buyTime: "",
    buyPrice: "",
    sumMoney: "",
    useNum: "",
    useDept: "",
    useTime: "",
    useUser: "",
    purpose: "",
    actualSurplus: "",
    remark: "",
    socketNumber: "",
    sign: "",
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "名称必填", trigger: "blur" }]
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
      label: "名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "颜色",
      prop: "colour",
      minWidth: 100
    },
    {
      label: "单位名称",
      prop: "deptName",
      minWidth: 100
    },
    {
      label: "采购数量",
      prop: "buyNumber",
      minWidth: 100
    },
    {
      label: "采购时间",
      prop: "buyTime",
      minWidth: 100
    },
    {
      label: "采购单价",
      prop: "buyPrice",
      minWidth: 100
    },
    {
      label: "合计金额",
      prop: "sumMoney",
      minWidth: 100
    },
    {
      label: "使用数量",
      prop: "useNum",
      minWidth: 100
    },
    {
      label: "使用部门",
      prop: "useDept",
      minWidth: 100
    },
    {
      label: "领用时间",
      prop: "useTime",
      minWidth: 100
    },
    {
      label: "领用人",
      prop: "useUser",
      minWidth: 100
    },
    {
      label: "用途",
      prop: "purpose",
      minWidth: 100
    },
    {
      label: "实际剩余",
      prop: "actualSurplus",
      minWidth: 100
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 100
    },
    {
      label: "插座序号",
      prop: "socketNumber",
      minWidth: 100
    },
    {
      label: "签字",
      prop: "sign",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 100
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
    propertyBusOfficialDelete(row.id).then(res => {
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
      propertyBusOfficialUpdate(addForm.value).then(res => {
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
      propertyBusOfficialSave(addForm.value).then(res => {
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
    const { data } = await propertyBusOfficialPage(query);
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
      colour: "",
      deptName: "",
      buyNumber: "",
      buyTime: "",
      buyPrice: "",
      sumMoney: "",
      useNum: "",
      useDept: "",
      useTime: "",
      useUser: "",
      purpose: "",
      actualSurplus: "",
      remark: "",
      socketNumber: "",
      sign: "",
    };
    queryForm.value.name = "";
    queryForm.value.beginTime = "";
    queryForm.value.endTime = "";
    dialogFormVisible.value = false;
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
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    moreCondition,
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleSubmitError,
    cancel,
    restartForm,
    openDia
  };
}
