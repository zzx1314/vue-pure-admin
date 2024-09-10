import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { ElLoading, type FormInstance, type FormRules } from "element-plus";
import {
  cerDelete,
  cerPage,
  cerSave,
  cerUpdate,
  downCer,
  getCaList
} from "@/api/otaCer";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useServer() {
  // ----变量定义-----
  const deftCheck = ref([]);
  const queryForm = reactive({
    parentId: null,
    name: "",
    domain: "",
    type: "",
    status: "",
    beginTime: "",
    endTime: ""
  });
  const parentId = ref(0);
  const caInfo = ref([]);
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
  const addForm = reactive({
    value: {
      id: null,
      parentId: 0,
      projName: "",
      modelName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: "",
      type: "server",
      remark: "",
      commonExpireDta: ""
    }
  });
  const rules = reactive<FormRules>({
    projName: [{ required: true, message: "所属项目必填", trigger: "blur" }],
    modelName: [{ required: true, message: "所属模块必填", trigger: "blur" }],
    password: [{ required: true, message: "密码必填", trigger: "blur" }],
    name: [{ required: true, message: "名称必填", trigger: "blur" }],
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
      width: 55,
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "所属项目",
      prop: "projName",
      minWidth: 100
    },
    {
      label: "所属模块",
      prop: "modelName",
      minWidth: 100
    },
    {
      label: "证书名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "创建人",
      minWidth: 180,
      prop: "createUser"
    },
    {
      label: "下载人",
      minWidth: 180,
      prop: "downUser"
    },
    {
      label: "下载时间",
      minWidth: 180,
      prop: "downTime"
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
  // 下载
  const handleDown = row => {
    downCer(row);
  };
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
    cerDelete(row.id).then(res => {
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
  async function onSearch() {
    loading.value = true;
    console.log("查询CA信息");
    getCaList().then(res => {
      console.log(res.data);
      caInfo.value = res.data;
      if (caInfo.value) {
        deftCheck.value = [caInfo.value[0].id];
        getCerInfo(caInfo.value[0].id);
      }
    });
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }

  async function getCerInfo(parntId: number) {
    parentId.value = parntId;
    loading.value = true;
    console.log("查询服务端证书");
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm
    };
    query.parentId = parntId;
    query.type = "server";
    const { data } = await cerPage(query);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };
  const restartForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    cancel();
    getCerInfo(parentId.value);
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      parentId: 0,
      projName: "",
      modelName: "",
      password: "",
      name: "",
      domain: "",
      expiryData: "",
      type: "ca",
      remark: "",
      commonExpireDta: ""
    };

    queryForm.name = "";
    queryForm.domain = "";
    queryForm.type = "";
    queryForm.status = "";
    dialogFormVisible.value = false;
    getCerInfo(parentId.value);
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: "制作服务端证书中",
          background: "rgba(0, 0, 0, 0.7)"
        });
        addForm.value.parentId = parentId.value;
        console.log(addForm.value);
        if (addForm.value.id) {
          // 修改
          console.log("修改客户端信息");
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
    moreCondition,
    columns,
    status,
    buttonClass,
    caInfo,
    deftCheck,
    handleDown,
    onSearch,
    getCerInfo,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
