import { computed, onMounted, reactive, ref, watch } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import { pSysMessagePage, pSysMessageDelete } from "@/api/pSysMessage";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { useMessageStoreHook } from "@/store/modules/message";

export function usePSysMessage() {
  // ----变量定义-----
  const queryForm = ref({
    ip: "",
    businessType: "",
    message: "",
    status: "",
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
  const addForm = reactive({
    value: {
      id: null
    }
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "称必填", trigger: "blur" }]
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
      label: "业务类型",
      prop: "businessType",
      minWidth: 100
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 60,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === "已处置" ? "success" : "warning"}
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "系统消息",
      prop: "message",
      minWidth: 100
    },
    {
      label: "处置内容",
      prop: "handleMessage",
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
      width: 160,
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
    pSysMessageDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
        useMessageStoreHook().setDeleteMessage(true);
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
    const { data } = await pSysMessagePage(query);
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
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null
    };
    queryForm.value.ip = "";
    queryForm.value.businessType = "";
    queryForm.value.message = "";
    queryForm.value.status = "";
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

  const messageStore = useMessageStoreHook();
  watch(
    () => messageStore.handleMessage,
    newValue => {
      if (newValue) {
        messageStore.handleMessage = false;
        onSearch();
      }
    }
  );
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
    handleSubmitError,
    cancel,
    restartForm,
    openDia
  };
}
