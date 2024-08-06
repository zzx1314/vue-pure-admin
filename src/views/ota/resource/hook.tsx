import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { FormRules, UploadUserFile } from "element-plus";
import { resDelete, resList, resPage } from "@/api/otaRes";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { CHUNK_SIZE } from "@/constants";
import { chunkDownloadFile } from "@/api/system";
import { downloadFileByBlob } from "@/lib/fileUtil";
import { devPage } from "@/api/otaDev";

export function useResource() {
  // ----变量定义-----
  const queryForm = reactive({
    softwareName: "",
    softwareVersion: "",
    devType: "",
    type: "",
    pkgName: "",
    version: ""
  });
  const dataList = ref([]);
  const devDataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogPushVisible = ref(false);
  const resDataList = ref([]);
  const devSecDataList = ref([]);
  const title = ref("");
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const paginationDev = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      softwareName: "",
      softwareVersion: "",
      devType: "",
      type: "",
      pkgName: "",
      version: "",
      parentId: null,
      level: null,
      remark: ""
    }
  });

  const pushForm = reactive({
    value: {
      taskName: "",
      taskType: "",
      remark: "",
      clientRestart: "",
      devInfos: [],
      resInfos: []
    }
  });
  const rules = reactive<FormRules>({
    softwareName: [
      { required: true, message: "操作系统名称必填", trigger: "blur" }
    ],
    softwareVersion: [
      { required: true, message: "操作系统版本必填", trigger: "blur" }
    ],
    devType: [{ required: true, message: "设备类型必填", trigger: "change" }],
    pkgName: [{ required: true, message: "组件包名称必填", trigger: "blur" }],
    version: [{ required: true, message: "组件包版本必填", trigger: "blur" }],
    parentId: [
      { required: true, message: "所属操作系统必填", trigger: "change" }
    ]
  });

  const pushRules = reactive<FormRules>({
    taskName: [{ required: true, message: "任务名称必填", trigger: "blur" }],
    taskType: [{ required: true, message: "任务类型必填", trigger: "blur" }],
    clientRestart: [{ required: true, message: "配置必填", trigger: "change" }]
  });
  const fileList = ref<UploadUserFile[]>();
  const addType = ref("");
  const updateType = ref("");
  const moreCondition = ref(false);
  const devOption = [
    {
      value: "altas200",
      label: "altas200"
    },
    {
      value: "sd3403",
      label: "sd3403"
    }
  ];
  const typeOption = [
    {
      value: "操作系统",
      label: "操作系统"
    },
    {
      value: "模块",
      label: "模块"
    }
  ];
  const resOsList = ref([]);
  const downPush = ref(false);
  const active = ref(1);
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
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={row.type === "操作系统" ? "success" : "info"}>
          {row.type}
        </el-tag>
      )
    },
    {
      label: "操作系统",
      prop: "softwareName",
      minWidth: 100
    },
    {
      label: "操作系统版本",
      prop: "softwareVersion",
      minWidth: 100
    },
    {
      label: "设备类型",
      prop: "devType",
      minWidth: 100
    },
    {
      label: "组件包名称",
      prop: "pkgName",
      minWidth: 120
    },
    {
      label: "组件包版本",
      prop: "version",
      minWidth: 120
    },
    {
      label: "文件大小",
      prop: "fileSize",
      minWidth: 120
    },
    {
      label: "文件名称",
      prop: "originFileName",
      minWidth: 120
    },
    {
      label: "MD5值",
      prop: "md5",
      minWidth: 120
    },
    {
      label: "上传时间",
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
      width: 180,
      slot: "operation"
    }
  ];
  const devClumns: TableColumnList = [
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
      label: "设备Ip",
      prop: "devIp",
      minWidth: 100
    },
    {
      label: "设备Id",
      prop: "devId",
      minWidth: 100
    },
    {
      label: "任务状态",
      prop: "status",
      minWidth: 100
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 100
    },
    {
      label: "组别",
      prop: "devGroup",
      minWidth: 100
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
  function handleUpdate(row) {
    console.log(row);
    addForm.value = row;
    const type = row.type;
    if (type === "操作系统") {
      openUpdateDia("修改操作系统");
    } else {
      openUpdateDia("修改模块");
    }
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    resDelete(row.id).then(res => {
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
  function handleDevSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleDevCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val: any[]) {
    console.log("选择资源信息", val);
    resDataList.value = val;
    console.log("resDataList", resDataList.value);
  }
  function handleDevSelectionChange(val: any[]) {
    console.log("设备信息", val);
    devSecDataList.value = val;
    console.log("devSecDataList", devSecDataList.value);
  }
  // 查询
  async function onSearch() {
    loading.value = true;
    console.log("查询资源信息");
    const { data } = await resPage(queryForm);
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function findList() {
    console.log("查询资源集合");
    const query = {
      parentId: 0
    };
    const { data } = await resList(query);
    resOsList.value = data;
    console.log(resOsList.value);
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
    queryForm.softwareName = "";
    queryForm.softwareVersion = "";
    queryForm.devType = "";
    queryForm.type = "";
    queryForm.pkgName = "";
    queryForm.version = "";

    addForm.value = {
      id: null,
      softwareName: "",
      softwareVersion: "",
      devType: "",
      type: "",
      pkgName: "",
      version: "",
      parentId: null,
      level: null,
      remark: ""
    };
    dialogFormVisible.value = false;
    fileList.value = [];
    onSearch();
  }
  function cancelPush(tableRef) {
    dialogPushVisible.value = false;
    resDataList.value = [];
    pushForm.value = {
      taskName: "",
      taskType: "",
      remark: "",
      clientRestart: "",
      devInfos: [],
      resInfos: []
    };
    const { clearSelection } = tableRef.getTableRef();
    clearSelection();
    active.value = 1;
    downPush.value = false;
  }
  // 打开弹框
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    if (param === "添加操作系统") {
      addType.value = "addSoftware";
    } else {
      addType.value = "addMode";
    }
    resetForm(formEl);
    console.log(addType.value);
  }

  async function openPushDia(formEl?) {
    resetForm(formEl);
    if (resDataList.value.length === 0) {
      message("请先选择资源！", { type: "warning" });
      return;
    }
    // 查询设备信息
    const { data } = await devPage();
    devDataList.value = data.records;
    paginationDev.total = data.total;
    dialogPushVisible.value = true;
  }

  function openUpdateDia(param) {
    dialogFormVisible.value = true;
    title.value = param;
    if (param === "修改操作系统") {
      updateType.value = "updateSoftware";
    } else {
      updateType.value = "updateMode";
    }
    console.log(updateType.value);
  }

  // ----下载---
  const state = reactive({
    dataSource: [],
    blobRef: new Map<number, BlobPart[]>()
  });
  async function handleDown(record) {
    console.log("下载", record);
    const totalChunks = Math.ceil(record.fileSize / CHUNK_SIZE);
    for (let i = 0; i <= totalChunks; i++) {
      const start = CHUNK_SIZE * (i - 1);
      let end = CHUNK_SIZE * i - 1;
      if (end > record.fileSize) end = record.fileSize; // 虽然超出不会影响内容读取，但是会影响进度条的展示
      try {
        console.log("调用接口", start, end);
        const query = {
          id: record.fileId,
          range: `bytes=${start}-${end}`
        };
        const res = await chunkDownloadFile(query);
        const currentDataBlob = state.blobRef.get(record.id) || [];
        // 记录当前数据的分片 blob
        state.blobRef.set(record.fileId, [
          ...currentDataBlob,
          res as unknown as BlobPart
        ]);
      } catch (error) {
        return;
      }
    }
    const blob = new Blob(state.blobRef.get(record.fileId));
    downloadFileByBlob(blob, record.originFileName);
  }

  onMounted(() => {
    onSearch();
    findList();
  });

  return {
    queryForm,
    dataList,
    devDataList,
    loading,
    dialogFormVisible,
    dialogPushVisible,
    title,
    pagination,
    paginationDev,
    addForm,
    pushForm,
    rules,
    pushRules,
    columns,
    buttonClass,
    addType,
    updateType,
    moreCondition,
    devOption,
    resOsList,
    fileList,
    typeOption,
    devClumns,
    resDataList,
    devSecDataList,
    downPush,
    active,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleDevSizeChange,
    handleCurrentChange,
    handleDevCurrentChange,
    handleSelectionChange,
    handleDevSelectionChange,
    cancel,
    cancelPush,
    openDia,
    openPushDia,
    restartForm,
    handleDown
  };
}
