import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
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
import WebSocketClient from "@/components/ReWebSocket";
import aesUtils from "@/utils/aes";

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
  const title = ref("");
  const dialogFormVisible = ref(false);
  const dialogShellVisible = ref(false);
  const dialogShellLoginVisible = ref(false);
  const terminal = ref(null);
  const webSocketShell = ref(null);

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
  const loginShellForm = ref({
    operate: "",
    host: "",
    port: "22",
    username: "",
    password: ""
  });
  const rules = reactive<FormRules>({
    host: [{ required: true, message: "主机必填", trigger: "blur" }],
    port: [{ required: true, message: "端口必填", trigger: "blur" }],
    username: [{ required: true, message: "用户名必填", trigger: "blur" }],
    password: [{ required: true, message: "密码必填", trigger: "blur" }]
  });
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
      label: "状态",
      prop: "status",
      minWidth: 80,
      slot: "content"
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
      const dialog = document.querySelector(
        ".shellDialog"
      ) as HTMLElement | null;
      let rows = dialog.offsetHeight / 16 - 10;
      let cols = dialog.offsetWidth / 9 - 10;
      terminal.value = new Terminal({
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
      terminal.value.write("\r\n");
      terminal.value.write("\x1B[1;3;34m 欢迎使用华郅终端\x1B[0m");
      terminal.value.focus();
      terminal.value.open(document.getElementById("terminal"));

      webSocketShell.value = new WebSocketClient();
      terminal.value.write("\r\nConnecting...");
      //执行连接操作
      webSocketShell.value.connect({
        onError: function (error) {
          //连接失败回调
          terminal.value.write("Error: " + error + "\r\n");
        },
        onConnect: function () {
          //连接主机
          webSocketShell.value.send(loginShellForm.value);
        },
        onClose: function () {
          //连接关闭回调
          terminal.value.write("\rconnection closed");
        },
        onData: function (data) {
          //收到数据时回调
          terminal.value.write(data);
        }
      });
      terminal.value.onData(e => {
        //键盘输入时的回调函数
        webSocketShell.value.sendClientData(e);
      });
    });
  }
  const handleShallLogin = row => {
    console.log("shallLogin", row);
    dialogShellLoginVisible.value = true;
    loginShellForm.value.host = row.deviceIp;
  };

  function handleDialogClosed() {
    dialogShellVisible.value = false;
    webSocketShell.value.disconnect();
    terminal.value.dispose();
    terminal.value = null;
    webSocketShell.value = null;
    cancel();
  }

  const handleShellSubmit = (values: FieldValues) => {
    console.log(values, "Submit");
    loginShellForm.value.operate = "connect";
    loginShellForm.value.password = aesUtils.encodeShell(
      loginShellForm.value.password
    );
    dialogShellLoginVisible.value = false;
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
    loginShellForm.value = {
      operate: "",
      host: "",
      port: "22",
      username: "",
      password: ""
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

    // 设置定时器，每分钟执行一次查询
    const intervalId = setInterval(() => {
      onSearch();
    }, 60000);
    // 在组件卸载时清除定时器
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  });

  return {
    queryForm,
    dataList,
    loading,
    title,
    pagination,
    addForm,
    loginShellForm,
    rules,
    columns,
    buttonClass,
    moreCondition,
    dialogFormVisible,
    dialogShellVisible,
    dialogShellLoginVisible,
    onSearch,
    resetForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSubmit,
    handleShellSubmit,
    handleSubmitError,
    handleDialogOpened,
    handleShallLogin,
    handleDialogClosed,
    cancel,
    restartForm,
    openDia
  };
}
