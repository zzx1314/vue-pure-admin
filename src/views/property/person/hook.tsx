import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  propertyPersonSave,
  propertyPersonPage,
  propertyPersonUpdate,
  propertyPersonDelete
} from "@/api/propertyPerson";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { actThProcessConfApplyBuniessTask } from "@/api/actThProcessConf";

export function usePropertyPerson() {
  // ----变量定义-----
  const queryForm = ref({
    name: "",
    beginTime: "",
    endTime: ""
  });
  // 变更申请
  const applyForm = ref({
    businessId: null,
    businessName: "",
    businessType: "",
    approverId: null,
    businessService: "",
    businessServiceChange: "",
    businessServiceEx: "",
    businessServiceReject: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const userDialogFormVisible = ref(false);
  const title = ref("");

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref({
    id: null,
    sign: ""
  });
  const distributeForm = ref({
    id: null,
    userId: null,
    propertyId: null,
    name: "",
    model: "",
    status: "",
    propertyType: "",
    serialNumber: "",
    propertyNumber: ""
  });
  const rules = reactive<FormRules>({
    sign: [{ required: true, message: "签名必填", trigger: "blur" }]
  });
  const rulesDistribute = reactive<FormRules>({
    name: [{ required: true, message: "用户名必填", trigger: "change" }]
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
      label: "名称",
      prop: "name",
      width: 100
    },
    {
      label: "型号",
      prop: "model",
      width: 100
    },
    {
      label: "状态",
      prop: "status",
      width: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === "已确认" ? "success" : "warning"}
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "审批状态",
      prop: "approvalStatus",
      width: 99,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.approvalStatus === 3 ? "success" : "warning"}
        >
          {row.approvalStatus
            ? row.approvalStatus === 1
              ? "待审批"
              : row.approvalStatus === 3
                ? "审批通过"
                : "驳回"
            : "未审批"}
        </el-tag>
      )
    },
    {
      label: "审批时间",
      prop: "approvalTime",
      width: 180
    },
    {
      label: "类型",
      prop: "propertyType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size}>
          {row.propertyType === "fix" ? "固定资产" : "办公资产"}
        </el-tag>
      )
    },
    {
      label: "序列号",
      prop: "serialNumber",
      width: 150
    },
    {
      label: "资产编码",
      prop: "propertyNumber",
      width: 150
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 180
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
  function handleUpdate(row, formEl) {
    console.log(row);
    const data = JSON.stringify(row);
    addForm.value = JSON.parse(data);
    openDia("确认资产信息", formEl);
  }

  function handlePersonUpdate(row, addUserFormRef) {
    console.log(row);
    userDialogFormVisible.value = true;
    distributeForm.value.id = row.id;
    distributeForm.value.propertyId = row.propertyId;
    distributeForm.value.name = row.name;
    distributeForm.value.model = row.model;
    distributeForm.value.status = row.status;
    distributeForm.value.propertyType = row.propertyType;
    distributeForm.value.propertyNumber = row.propertyNumber;
    distributeForm.value.serialNumber = row.serialNumber;
    resetForm(addUserFormRef);
  }

  // 删除
  function handleDelete(row) {
    console.log(row);
    propertyPersonDelete(row.id).then(res => {
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
      propertyPersonUpdate(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("确认资产成功！", { type: "success" });
          cancel();
        } else {
          message("确认资产失败！", { type: "error" });
        }
      });
    } else {
      // 新增
      console.log("新增");
      propertyPersonSave(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("保存成功！", { type: "success" });
          cancel();
        } else {
          message(res.msg, { type: "error" });
        }
      });
    }
  };

  // 资产变更
  const handleSubmitUser = (values: FieldValues) => {
    console.log(values, "发起资产变更");
    const updateApproverForm = {
      id: distributeForm.value.propertyId,
      owner: distributeForm.value.userId,
      name: distributeForm.value.name,
      model: distributeForm.value.model,
      propertyType: distributeForm.value.propertyType,
      propertyNumber: distributeForm.value.propertyNumber,
      serialNumber: distributeForm.value.serialNumber
    };
    applyForm.value.businessId = distributeForm.value.id;
    applyForm.value.businessType = "资产变更";
    applyForm.value.approverId = distributeForm.value.userId;
    applyForm.value.businessName = distributeForm.value.name;
    applyForm.value.businessService = "propertyBusPersonService";
    console.log(updateApproverForm);
    const param = {
      changeService:
        distributeForm.value.propertyType === "fix"
          ? "propertyBusFixService"
          : "propertyBusOfficialService",
      filed: updateApproverForm
    };
    applyForm.value.businessServiceChange = JSON.stringify(param);
    actThProcessConfApplyBuniessTask(applyForm.value).then(res => {
      if (res.code === SUCCESS) {
        message("提交成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });
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
    const { data } = await propertyPersonPage(query);
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
      sign: ""
    };
    queryForm.value.name = "";
    queryForm.value.beginTime = "";
    queryForm.value.endTime = "";
    dialogFormVisible.value = false;
    distributeForm.value = {
      id: null,
      userId: null,
      propertyId: null,
      name: "",
      model: "",
      status: "",
      propertyType: "",
      serialNumber: "",
      propertyNumber: ""
    };
    userDialogFormVisible.value = false;
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
    userDialogFormVisible,
    title,
    pagination,
    addForm,
    distributeForm,
    rules,
    rulesDistribute,
    columns,
    buttonClass,
    moreCondition,
    onSearch,
    resetForm,
    handleUpdate,
    handlePersonUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleSubmitUser,
    handleSubmitError,
    cancel,
    restartForm,
    openDia
  };
}
