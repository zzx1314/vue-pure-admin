import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { ElLoading, type FormInstance, type FormRules } from "element-plus";
import {
  cerDelete,
  cerPage,
  cerSave,
  cerUpdate,
  downCer,
  getProjList,
  loseEfficacy
} from "@/api/cerBus";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { getProjSelectApi } from "@/api/cerProj";

export function useProjCer() {
  // ----变量定义-----
  const deftCheck = ref([]);
  const queryForm = reactive({
    projQueryId: null,
    name: "",
    domain: "",
    type: "",
    status: "",
    beginTime: "",
    endTime: "",
    projName: ""
  });
  const parentId = ref(0);
  const projInfo = ref([]);
  const projOption = ref([]);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const title = ref("");
  const isUpdateProj = ref(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      projArray: [],
      parentId: 0,
      projId: null,
      projName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: null,
      commonExpireDta: "",
      type: "",
      remark: "",
      updateProj: false
    }
  });
  const rules = reactive<FormRules>({
    projArray: [{ required: true, message: "所属项目必填", trigger: "change" }],
    type: [{ required: true, message: "证书类型必填", trigger: "change" }],
    password: [{ required: true, message: "密码必填", trigger: "blur" }],
    name: [{ required: true, message: "证书名称必填", trigger: "blur" }],
    domain: [{ required: true, message: "域名必填", trigger: "blur" }],
    expiryData: [{ required: true, message: "失效时间必填", trigger: "change" }]
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
      label: "所属项目",
      prop: "projName",
      minWidth: 100
    },
    {
      label: "证书类型",
      prop: "type",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.type === "ca"
              ? "success"
              : row.type === "client"
                ? "warning"
                : "primary"
          }
        >
          {row.type === "ca"
            ? "CA"
            : row.type === "client"
              ? "客户端"
              : "服务端"}
        </el-tag>
      )
    },
    {
      label: "证书名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "域名",
      prop: "domain",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "创建人",
      minWidth: 100,
      prop: "createUser"
    },
    {
      label: "状态值",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "已使用"
              ? "success"
              : row.status === "未生效"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "失效期限",
      minWidth: 180,
      prop: "expiryDataStr"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
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
  // 修改
  function handleUpdate(row, formEl) {
    console.log(row);
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);
    addForm.value.projArray = row.projId.split(",");
    openDia("修改证书", formEl);
  }
  // 修改项目
  function handleUpdateProj(row, formEl) {
    console.log(row);
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);
    addForm.value.projArray = row.projId.split(",");
    addForm.value.updateProj = true;
    isUpdateProj.value = true;
    openDia("修改项目", formEl);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    cerDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        cancel();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  // 证书失效
  const handleLoseEfficacy = row => {
    console.log(row);
    loseEfficacy(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("失效成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  };

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    getCerInfo(parentId.value);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    getCerInfo(parentId.value);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 查询
  function onSearchOne() {
    loading.value = true;
    console.log("查询项目集合");
    getProjList().then(res => {
      console.log(res.data);
      projInfo.value = res.data;
      if (projInfo.value) {
        /*deftCheck.value = [projInfo.value[0].id];
        getCerInfo(projInfo.value[0].id);*/
        getCerInfo(null);
      }
    });
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
  function onSearch() {
    loading.value = true;
    console.log("查询项目集合");
    getCerInfo(parentId.value);
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
  async function getCerInfo(parntId: number) {
    parentId.value = parntId;
    loading.value = true;
    console.log("查询证书列表");
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm
    };
    query.projQueryId = parntId;
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await cerPage(query);
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
      onSearch();
    });
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      projArray: [],
      parentId: 0,
      projId: null,
      projName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: null,
      type: "",
      remark: "",
      commonExpireDta: "",
      updateProj: false
    };

    queryForm.name = "";
    queryForm.domain = "";
    queryForm.type = "";
    queryForm.status = "";
    queryForm.projName = "";
    queryForm.type = "";
    dialogFormVisible.value = false;
    isUpdateProj.value = false;
    getCerInfo(parentId.value);
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "制作证书中",
          background: "rgba(0, 0, 0, 0.7)"
        });
        addForm.value.parentId = parentId.value;
        if (
          addForm.value.commonExpireDta &&
          addForm.value.commonExpireDta !== ""
        ) {
          addForm.value.expiryData = null;
        }
        if (addForm.value.id) {
          // 修改
          console.log("修改信息");
          addForm.value.updateProj = false;
          addForm.value.projId = addForm.value.projArray.join(",");
          cerUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
            loading.close();
          });
        } else {
          // 新增
          console.log("新增信息");
          addForm.value.projId = addForm.value.projArray.join(",");
          cerSave(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("保存成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
            loading.close();
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
    getProjSelect();
    resetForm(formEl);
  }
  // 获取项目下拉
  function getProjSelect() {
    getProjSelectApi().then(res => {
      projOption.value = res.data;
    });
  }
  // 下载
  const handleDown = row => {
    downCer(row).then(res => {
      console.log(res);
      getCerInfo(parentId.value);
    });
  };

  onMounted(() => {
    onSearchOne();
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
    moreCondition,
    columns,
    status,
    buttonClass,
    projInfo,
    projOption,
    deftCheck,
    isUpdateProj,
    getCerInfo,
    onSearch,
    resetForm,
    handleUpdate,
    handleUpdateProj,
    handleDelete,
    handleLoseEfficacy,
    handleDown,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
