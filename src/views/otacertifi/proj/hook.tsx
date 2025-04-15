import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";
import { projPage, projSave, projUpdate, projDelete } from "@/api/cerProj";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { getUserByRoleIdNoPage } from "@/api/user";
import { getFeatureSelect } from "@/api/cerFeatures";
import {actThProcessConfApplyBuniessTask, actThProcessConfGetFirstNode} from "@/api/actThProcessConf";

export function useProj() {
  // ----变量定义-----
  const queryForm = reactive({
    projName: "",
    userName: "",
    featuresName: "",
    beginTime: "",
    endTime: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const title = ref("");
  const customerList = ref([]);
  const featureList = ref([]);
  const dialogFormVisibleApprove = ref(false);
  const approverOptions = ref([]);
  const applyForm = ref({
    businessId: null,
    businessType: "",
    approverId: null,
    businessServiceChange: {
      changeService: "LicenseBusProjService",
      filed: null
    }
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      projName: "",
      projCode: "",
      customerId: null,
      featuresIdArray: [],
      featuresId: "",
      liceNum: "",
      liceTime: "",
      liceTimeArray: [],
      liceMode: "",
      remark: "",
      approverId: ""
    }
  });
  const rules = reactive<FormRules>({
    projName: [{ required: true, message: "项目名称", trigger: "blur" }],
    projCode: [
      { required: true, message: "项目编码", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: "项目编码只能是英文,数字，下划线",
        trigger: "blur"
      }
    ],
    customerId: [{ required: true, message: "客户必填", trigger: "change" }],
    featuresIdArray: [
      { required: true, message: "特性必填", trigger: "change" }
    ],
    liceNum: [
      { required: true, message: "授权数量必填", trigger: "blur" },
      {
        pattern: /^\d+$/,
        message: "授权数量必须是数字",
        trigger: "blur"
      }
    ],
    liceTimeArray: [
      { required: true, message: "有效期限必填", trigger: "change" }
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
      label: "客户账号",
      prop: "customerName",
      minWidth: 100
    },
    {
      label: "项目名称",
      prop: "projName",
      minWidth: 100
    },
    {
      label: "项目编码",
      prop: "projCode",
      minWidth: 100
    },
    {
      label: "特性信息",
      prop: "featuresName",
      minWidth: 200,
      slot: "content"
    },
    {
      label: "授权数量",
      prop: "liceNum",
      minWidth: 100
    },
    {
      label: "使用数量",
      prop: "useLicNum",
      minWidth: 80
    },
    {
      label: "授权时间",
      prop: "liceTime",
      minWidth: 180
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      minWidth: 170,
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
    const rowData = JSON.stringify(row);
    addForm.value = JSON.parse(rowData);
    addForm.value.featuresIdArray = row.featuresId.split(",").map(Number);
    addForm.value.liceTimeArray = row.liceTime.split(",");
    openDia("修改", formEl);
  }
  function handleUpdateApprove(row, formEl) {
    console.log(row);
    const rowData = JSON.stringify(row);
    addForm.value = JSON.parse(rowData);
    addForm.value.featuresIdArray = row.featuresId.split(",").map(Number);
    addForm.value.liceTimeArray = row.liceTime.split(",");
    dialogFormVisibleApprove.value = true;
    actThProcessConfGetFirstNode("授权项目变更").then(res => {
      if (res.code === SUCCESS) {
        approverOptions.value = res.data;
      } else {
        message(res.msg, { type: "error" });
      }
    });
    openDia("变更审批", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    projDelete(row.id).then(res => {
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
    console.log("查询项目信息");
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
    const { data } = await projPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
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
      projName: "",
      projCode: "",
      customerId: null,
      featuresId: "",
      featuresIdArray: [],
      liceNum: "",
      liceTime: "",
      liceTimeArray: [],
      liceMode: "",
      remark: "",
      approverId: ""
    };

    queryForm.projName = "";
    queryForm.userName = "";
    queryForm.featuresName = "";
    queryForm.beginTime = "";
    queryForm.endTime = "";
    dialogFormVisible.value = false;
    dialogFormVisibleApprove.value = false;
    customerList.value = [];
    console.log(addForm.value);
    onSearch();
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        addForm.value.featuresId = addForm.value.featuresIdArray.join(",");
        addForm.value.liceTime = addForm.value.liceTimeArray.join(",");
        if (addForm.value.id) {
          // 修改
          console.log("修改特性信息");
          projUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        } else {
          // 新增
          console.log("新增信息", addForm.value);
          projSave(addForm.value).then(res => {
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
  const submitFormApprover = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        addForm.value.featuresId = addForm.value.featuresIdArray.join(",");
        addForm.value.liceTime = addForm.value.liceTimeArray.join(",");
        console.log(addForm.value);
        applyForm.value.businessId = addForm.value.id;
        applyForm.value.businessType = "授权项目变更";
        applyForm.value.approverId = addForm.value.approverId;
        applyForm.value.businessServiceChange.filed = JSON.stringify(
          addForm.value
        );
        actThProcessConfApplyBuniessTask(applyForm.value).then(res => {
          if (res.code === SUCCESS) {
            message("提交成功！", { type: "success" });
            cancel();
          } else {
            message(res.msg, { type: "error" });
          }
        });
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  // 打开弹框
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    console.log("openDia..", addForm.value);
    resetForm(formEl);
    getSelectInfo();
  }
  // 获取下拉数据
  function getSelectInfo() {
    getUserByRoleIdNoPage({ role: 1044 }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        customerList.value.push({
          value: res.data[i].id,
          label: res.data[i].username
        });
      }
    });
    getFeatureSelect().then(res => {
      featureList.value = res.data;
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
    dialogFormVisibleApprove,
    title,
    pagination,
    addForm,
    rules,
    moreCondition,
    columns,
    status,
    buttonClass,
    customerList,
    featureList,
    approverOptions,
    onSearch,
    resetForm,
    handleUpdate,
    handleUpdateApprove,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    submitFormApprover,
    openDia
  };
}
