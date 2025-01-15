import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormRules } from "element-plus";
import {
  oBusDeviceSave,
  oBusDevicePage,
  oBusDeviceUpdate,
  oBusDeviceDelete
} from "@/api/oBusDevice";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { Terminal } from "@xterm/xterm";

export function useOBusDevice() {
  // ----变量定义-----
  const queryForm = ref({
    deviceId: "",
    deviceIp: "",
    os: "",
    osVersion: "",
    arch: "",
    hardwareInfo: "",
    softwareInfo: "",
    systemStatus: "",
    beginTime: "",
    endTime: "",
    status: ""
  });
  const moreCondition = ref(false);
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogShellVisible = ref(false);
  const title = ref("");

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = ref({
    id: null,
    deviceId: "",
    deviceIp: "",
    os: "",
    osVersion: "",
    arch: "",
    remark: ""
  });
  const rules = reactive<FormRules>({});
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
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
      label: "设备ID",
      prop: "deviceId",
      minWidth: 100
    },
    {
      label: "设备IP",
      prop: "deviceIp",
      minWidth: 100
    },
    {
      label: "操作系统",
      prop: "os",
      minWidth: 100
    },
    {
      label: "操作系统版本",
      prop: "osVersion",
      minWidth: 100
    },
    {
      label: "系统架构",
      prop: "arch",
      minWidth: 100
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 150
    },
    {
      label: "通信时间",
      prop: "commTime",
      minWidth: 150
    },
    {
      label: "系统架构",
      prop: "arch",
      minWidth: 100
    },
    {
      label: "状态",
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
      label: "备注",
      prop: "remark",
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
    oBusDeviceDelete(row.id).then(res => {
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
      oBusDeviceUpdate(addForm.value).then(res => {
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
      oBusDeviceSave(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          message("保存成功！", { type: "success" });
          cancel();
        } else {
          message(res.msg, { type: "error" });
        }
      });
    }
  };
  function handleDialogOpened() {
    nextTick(() => {
      const dialog = document.querySelector(".el-dialog") as HTMLElement | null;
      let rows = dialog.offsetHeight / 16 - 10;
      let cols = dialog.offsetWidth / 9 - 10;
      let term = new Terminal({
        rows: parseInt(rows), //行数
        cols: parseInt(cols),
        convertEol: true,
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "block", //光标样式
        cursorBlink: true, //光标闪烁
        tabStopWidth: 8, //制表宽度
        theme: {
          foreground: "White", //字体,LightGreen,Orange,SlateBlue,Magenta Purple Red Violet White Yellow
          background: "#2B2B2B", //背景色
          cursor: "Orange" //设置光标
        }
      });
      term.open(document.getElementById("terminal"));
      term.write("\r\n");
      term.write("欢迎使用华郅终端\r\n$ ");
      term.focus();
      term.onData(data => {
        // 处理终端输入的数据
        console.log(data);
      });
    });
  }
  const handleShallLogin = row => {
    console.log("shallLogin", row);
    dialogShellVisible.value = true;
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
    const { data } = await oBusDevicePage(query);
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
      deviceId: "",
      deviceIp: "",
      os: "",
      osVersion: "",
      arch: "",
      remark: ""
    };
    queryForm.value.deviceId = "";
    queryForm.value.deviceIp = "";
    queryForm.value.os = "";
    queryForm.value.osVersion = "";
    queryForm.value.arch = "";
    queryForm.value.hardwareInfo = "";
    queryForm.value.softwareInfo = "";
    queryForm.value.systemStatus = "";
    queryForm.value.beginTime = "";
    queryForm.value.endTime = "";
    queryForm.value.status = "";
    dialogFormVisible.value = false;
    onSearch();
  }
  // 打开弹框
  function openDia(param, formEl) {
    dialogFormVisible.value = true;
    title.value = "修改设备信息";
    addForm.value = param;
    resetForm(formEl);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    queryForm,
    dataList,
    loading,
    title,
    pagination,
    addForm,
    rules,
    columns,
    buttonClass,
    moreCondition,
    dialogFormVisible,
    dialogShellVisible,
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleSubmitError,
    handleDialogOpened,
    handleShallLogin,
    cancel,
    restartForm,
    openDia
  };
}
