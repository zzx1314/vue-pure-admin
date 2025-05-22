import { computed, nextTick, onMounted, reactive, type Ref, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import {
  ElMessageBox,
  type FormRules,
  type UploadUserFile
} from "element-plus";
import { resDelete, resList, resPageV1 } from "@/api/otaRes";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { CHUNK_SIZE } from "@/constants";
import { chunkDownloadFile } from "@/api/system";
import { downloadFileByBlob } from "@/lib/fileUtil";
import { devPage, getDevGroupSelect } from "@/api/otaDev";
import { convertFileSizeUnit } from "@/lib/fileUtil";

export function useResource() {
  // ----变量定义-----
  const queryForm = reactive({
    softwareName: "",
    softwareVersion: "",
    devType: "",
    type: "",
    pkgName: "",
    version: "",
    resType: ""
  });
  const queryFormDev = reactive({
    devIp: "",
    devId: "",
    type: "",
    devGroup: "",
    devGroupList: []
  });
  const dataList = ref([]);
  const dataListMode = ref([]);
  const devDataList = ref([]);
  const devGroupSelectList = ref([]);
  const loading = ref(true);
  const modelLoading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogPushVisible = ref(false);
  const resDataList = ref([]);
  const devSecDataList = ref([]);
  const title = ref("");
  const expandRowKeys = ref<number[]>([]);

  const showDiaLoading = ref(false);
  const percentage: Ref<number> = ref(0);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const paginationSon = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    small: true,
    align: "center",
    class: "pageSonClass"
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
      remark: "",
      originFileName: ""
    }
  });

  const pushForm = reactive({
    value: {
      taskName: "",
      taskType: "",
      remark: "",
      clientRestart: "",
      devInfos: [],
      resInfos: [],
      queryDev: {}
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
    pkgName: [{ required: true, message: "模块名称必填", trigger: "blur" }],
    version: [{ required: true, message: "模块版本必填", trigger: "blur" }],
    parentId: [
      { required: true, message: "所属操作系统必填", trigger: "change" }
    ]
  });

  const pushRules = reactive<FormRules>({
    taskName: [{ required: true, message: "任务名称必填", trigger: "blur" }],
    taskType: [{ required: true, message: "任务类型必填", trigger: "blur" }],
    clientRestart: [{ required: true, message: "配置必填", trigger: "change" }]
  });
  const fileList = ref<UploadUserFile[]>([]);
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
    },
    {
      value: "3576",
      label: "3576"
    },
    {
      value: "RK3588",
      label: "RK3588"
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
  const resTypeOption = [
    {
      value: "驱动",
      label: "驱动"
    },
    {
      value: "固件",
      label: "固件"
    },
    {
      value: "设备树",
      label: "设备树"
    },
    {
      value: "文件系统",
      label: "文件系统"
    },
    {
      value: "镜像",
      label: "镜像"
    },
    {
      value: "其他",
      label: "其他"
    }
  ];
  const resOsList = ref([]);
  const downPush = ref(false);
  const active = ref(1);
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand",
      width: 50,
      fixed: "left"
    },
    {
      type: "selection",
      width: 50,
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
      label: "设备状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "在线"
              ? "success"
              : row.status === "离线"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
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

  const progressVisible = ref(false);
  const progress = ref(0);
  // -----方法定义---
  // 修改
  function handleUpdate(row) {
    console.log(row);
    addForm.value = row;
    const type = row.type;
    if (type === "操作系统") {
      openUpdateDia("修改操作系统");
    } else {
      fileList.value.push({
        url: row.originFileName,
        name: row.originFileName,
        status: "success"
      });
      openUpdateDia("修改模块");
    }
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    resDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearchMode(expandRowKeys.value[0]);
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
  function handleSizeChangeMode(val: number) {
    console.log(`${val} items per page`);
    paginationSon.pageSize = val;
    onSearchMode(expandRowKeys.value[0]);
  }

  function handleDevSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    onSearchDev();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleCurrentChangeMode(val: number) {
    console.log(`current page: ${val}`);
    paginationSon.currentPage = val;
    onSearchMode(expandRowKeys.value[0]);
  }

  function handleExpandChange(row, rowArray) {
    console.log("点击关闭或者展开", row.id, rowArray);
    if (rowArray.includes(row)) {
      expandRowKeys.value = [];
      expandRowKeys.value.push(row.id);
      console.log("展开行");
      onSearchMode(row.id);
    }
  }

  async function onSearchMode(parentId: number) {
    modelLoading.value = true;
    console.log("查询模块信息");
    const page = {
      size: paginationSon.pageSize,
      current: paginationSon.currentPage
    };
    const query = {
      ...page,
      ...queryForm,
      parentId: parentId,
      type: "模块"
    };
    const { data } = await resPageV1(query);
    dataListMode.value = data.records;
    paginationSon.total = data.total;
    // 对dataList中的fileSize 进行格式化
    dataListMode.value.forEach(item => {
      if (item.fileSize) {
        item.fileSizeShow = convertFileSizeUnit(item.fileSize);
      }
    });
    setTimeout(() => {
      modelLoading.value = false;
    }, 500);
  }

  function handleDevCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearchDev();
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
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryForm,
      type: "操作系统"
    };
    const { data } = await resPageV1(query);
    dataList.value = data.records;
    pagination.total = data.total;
    // 对dataList中的fileSize 进行格式化
    dataList.value.forEach(item => {
      if (item.fileSize) {
        item.fileSizeShow = convertFileSizeUnit(item.fileSize);
      }
    });
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
  // 查询组别下拉选项
  async function findGroup() {
    console.log("查询组别");
    const { data } = await getDevGroupSelect();
    devGroupSelectList.value = data;
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
    formEl.clearValidate();
  };
  const restartForm = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.resetFields();
      cancel();
    });
  };
  const restartFormMode = formEl => {
    if (!formEl) return;
    nextTick(() => {
      formEl.resetFields();
      cancelMode();
    });
  };
  // 取消模块
  function cancelMode() {
    queryForm.pkgName = "";
    queryForm.version = "";
    queryForm.resType = "";
    onSearchMode(expandRowKeys.value[0]);
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
      remark: "",
      originFileName: ""
    };
    dialogFormVisible.value = false;
    fileList.value = [];
    addType.value = "";
    updateType.value = "";
    devSecDataList.value = [];
  }
  // 取消
  function cancel() {
    queryForm.softwareName = "";
    queryForm.softwareVersion = "";
    queryForm.devType = "";
    queryForm.type = "";
    queryForm.pkgName = "";
    queryForm.version = "";
    queryForm.resType = "";

    queryFormDev.devIp = "";
    queryFormDev.devId = "";
    queryFormDev.type = "";
    queryFormDev.devGroup = "";
    queryFormDev.devGroupList = [];

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
      remark: "",
      originFileName: ""
    };
    dialogFormVisible.value = false;
    fileList.value = [];
    addType.value = "";
    updateType.value = "";
    devSecDataList.value = [];
    onSearch();
  }
  function cancelPush(tableRef, tableRefMod) {
    dialogPushVisible.value = false;
    resDataList.value = [];
    pushForm.value = {
      taskName: "",
      taskType: "",
      remark: "",
      clientRestart: "",
      devInfos: [],
      resInfos: [],
      queryDev: {}
    };
    const { clearSelection } = tableRef.getTableRef();
    clearSelection();
    tableRefMod.getTableRef().clearSelection();
    active.value = 1;
    downPush.value = false;
  }
  // 打开弹框
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    if (param === "新增操作系统") {
      addType.value = "addSoftware";
    } else {
      addType.value = "addMode";
      findList();
    }
    resetForm(formEl);
    console.log(addType.value);
  }

  function openPushDia(formEl?) {
    resetForm(formEl);
    if (resDataList.value.length === 0) {
      message("请先选择资源！", { type: "warning" });
      return;
    }
    // 如果选择的操作系统大于两个，将不允许升级
    const osCount = resDataList.value.filter(item => {
      return item.type === "操作系统";
    }).length;
    if (osCount > 1) {
      message("不能选择多个操作系统升级", { type: "warning" });
      return;
    }
    // 如果选择的资源只有操作系统，需要提示，是否将整个操作系统的包升级
    if (
      resDataList.value.length === 1 &&
      resDataList.value[0].type === "操作系统"
    ) {
      ElMessageBox.confirm(
        `确认要升级<strong style='color:var(--el-color-primary)'>${
          resDataList.value[0].softwareName
        }</strong>吗?如果确认将会将操作系统下的所有软件包推送到设备上`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        // 查询设备信息
        onSearchDev();
        dialogPushVisible.value = true;
      });
    } else {
      onSearchDev();
      dialogPushVisible.value = true;
    }
  }
  // 查询设备信息
  async function onSearchDev() {
    const page = {
      size: pagination.pageSize,
      current: pagination.currentPage
    };
    const query = {
      ...page,
      ...queryFormDev
    };
    // 查询设备信息
    const { data } = await devPage(query);
    devDataList.value = data.records;
    paginationDev.total = data.total;
  }

  function openUpdateDia(param) {
    dialogFormVisible.value = true;
    title.value = param;
    if (param === "修改操作系统") {
      updateType.value = "updateSoftware";
    } else {
      updateType.value = "updateMode";
      findList();
    }
    console.log(updateType.value);
  }

  // ----下载---
  const state = reactive({
    dataSource: [],
    blobRef: new Map<number, BlobPart[]>()
  });
  async function handleDown(record) {
    showDiaLoading.value = true;
    console.log("下载", record.originFileName);
    const totalChunks = Math.ceil(record.fileSize / CHUNK_SIZE);
    for (let i = 1; i <= totalChunks; i++) {
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
        const currentDataBlob = state.blobRef.get(record.fileId) || [];
        // 记录当前数据的分片 blob
        state.blobRef.set(record.fileId, [
          ...currentDataBlob,
          res as unknown as BlobPart
        ]);
        percentage.value = Math.round((i / totalChunks) * 100);
      } catch (error) {
        message("下载失败！" + i + "分片下载失败！" + error, { type: "error" });
        return;
      }
    }
    showDiaLoading.value = false;
    const blob = new Blob(state.blobRef.get(record.fileId), {
      type: "application/octet-stream"
    });
    downloadFileByBlob(blob, record.originFileName);
    message("下载成功！", { type: "success" });
    percentage.value = 0;
  }

  const closeDiaLoad = () => {
    showDiaLoading.value = false;
  };

  onMounted(() => {
    onSearch();
    findGroup();
  });

  return {
    queryForm,
    queryFormDev,
    dataList,
    dataListMode,
    devDataList,
    devGroupSelectList,
    loading,
    modelLoading,
    dialogFormVisible,
    dialogPushVisible,
    title,
    pagination,
    paginationDev,
    paginationSon,
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
    resTypeOption,
    resOsList,
    fileList,
    typeOption,
    devClumns,
    resDataList,
    devSecDataList,
    downPush,
    active,
    progressVisible,
    progress,
    expandRowKeys,
    percentage,
    showDiaLoading,
    onSearch,
    onSearchDev,
    onSearchMode,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleSizeChangeMode,
    handleCurrentChangeMode,
    handleDevSizeChange,
    handleCurrentChange,
    handleExpandChange,
    handleDevCurrentChange,
    handleSelectionChange,
    handleDevSelectionChange,
    cancel,
    cancelPush,
    cancelMode,
    openDia,
    openPushDia,
    restartForm,
    restartFormMode,
    handleDown,
    closeDiaLoad
  };
}
