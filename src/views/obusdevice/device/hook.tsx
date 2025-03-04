import {
  computed,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";
import {
  getHardWareInfo,
  getHistoryOnOrOffine,
  getSysStatus,
  oBusDeviceDelete,
  oBusDevicePage,
  oBusDeviceSave,
  oBusDeviceUpdate,
  oBusPushCommand
} from "@/api/oBusDevice";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import type { FieldValues } from "plus-pro-components";
import { Terminal } from "@xterm/xterm";
import WebSocketClient from "@/components/ReWebSocket";
import aesUtils from "@/utils/aes";
import { useRenderFlicker } from "@/components/ReFlicker";
import { getSelectByType } from "@/api/system";

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
  const dialogHardWareVisible = ref(false);
  const dialogSoftInfoVisible = ref(false);
  const dialogSysStatusVisible = ref(false);
  const dialogDeviceOnOrLineVisible = ref(false);
  const dialogCommandVisible = ref(false);
  const dialogShellLoginVisible = ref(false);
  const terminal = ref(null);
  const webSocketShell = ref(null);
  const expandRowKeys = ref([]);
  const hardwareInfo = ref<any>({});
  const memColor = ref<string>("#67C23A");
  const memNumber = ref(0);
  const diskColor = ref<string>("#67C23A");
  const diskNumber = ref(null);
  const cpuPercent = ref(0);
  const commandOptions = ref([]);
  const logPathOptions = ref([]);
  const CommonCommandOptions = ref([]);

  const cpuHistory = ref<any>({});
  const memHistory = ref<any>({});
  const diskHistory = ref<any>({});

  const activities = ref([]);
  const regularExpression = ref([]);
  const softwareInfoJArray = ref([]);

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
  const commandForm = ref({
    content: "",
    deviceId: "",
    type: "",
    logPath: "",
    lable: ""
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
  const rulesCommand = reactive<FormRules>({
    type: [{ required: true, message: "指令类型必填", trigger: "change" }],
    logPath: [{ required: true, message: "日志路径必填", trigger: "change" }]
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
      label: "硬件信息",
      prop: "hardwareInfo",
      minWidth: 100,
      slot: "hardwareInfoSlot"
    },
    {
      label: "软件信息",
      prop: "softInfo",
      minWidth: 100,
      slot: "softInfoSlot"
    },
    {
      label: "系统状态",
      prop: "systemInfo",
      minWidth: 100,
      slot: "systemInfoSlot"
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 150
    },
    {
      label: "通信时间",
      prop: "commTime",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-button
          size={props.size}
          type="primary"
          text
          onClick={() => handleCommTime(row)}
        >
          {row.commTime}
        </el-button>
      )
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
      width: 130,
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

  function handleDialogInfoClose() {
    dialogHardWareVisible.value = false;
    dialogSysStatusVisible.value = false;
    dialogDeviceOnOrLineVisible.value = false;
    dialogCommandVisible.value = false;
    dialogSoftInfoVisible.value = false;
    softwareInfoJArray.value = [];
    memNumber.value = 0;
    memColor.value = "#67C23A";
    diskNumber.value = 0;
    diskColor.value = "#67C23A";
    cpuPercent.value = 0;
    dialogShellLoginVisible.value = false;
    cpuHistory.value = {};
    diskHistory.value = {};
    memHistory.value = {};
    activities.value = [];
    commandForm.value = {
      content: "",
      deviceId: "",
      type: "",
      logPath: "",
      lable: ""
    };
  }

  function handleDialogHardWareInfo(row) {
    dialogHardWareVisible.value = true;
    getHardWareInfo(row.id).then(res => {
      if (res.code === SUCCESS) {
        console.log(res.data);
        hardwareInfo.value = res.data;
      }
    });
  }

  function handleDialogSysStem(row) {
    dialogSysStatusVisible.value = true;
    getSysStatus(row.id).then(res => {
      if (res.code === SUCCESS) {
        console.log(res.data);
        memNumber.value = res.data.useMemRatio.value;
        memColor.value = res.data.useMemRatio.color;
        diskNumber.value = res.data.useDiskRatio.value;
        diskColor.value = res.data.useDiskRatio.color;
        cpuPercent.value = res.data.useCpuRatio.value;

        if (res.data.historySystemInfo) {
          cpuHistory.value.x = res.data.historySystemInfo.useCpuRatio.x;
          cpuHistory.value.y = res.data.historySystemInfo.useCpuRatio.y;

          diskHistory.value.x = res.data.historySystemInfo.useDiskRatio.x;
          diskHistory.value.y = res.data.historySystemInfo.useDiskRatio.y;

          memHistory.value.x = res.data.historySystemInfo.useMemRatio.x;
          memHistory.value.y = res.data.historySystemInfo.useMemRatio.y;
        }
      }
    });
  }
  function handleDialogSlot(row) {
    console.log("handleDialogSlot", row);
    dialogSoftInfoVisible.value = true;
    softwareInfoJArray.value.push(...row.softwareInfoJArray);
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

  function handleExpandChange(row, rowArray) {
    console.log("点击关闭或者展开", row.id, rowArray);
    if (rowArray.includes(row)) {
      expandRowKeys.value = [];
      expandRowKeys.value.push(row.id);
      console.log("展开行");
    }
  }
  function downCommand(row, commandFormRef) {
    console.log("downCommand", row);
    dialogCommandVisible.value = true;
    commandForm.value.deviceId = row.deviceId;
    getSelectByType("command_type").then(res => {
      if (res.code === SUCCESS) {
        commandOptions.value = res.data;
        console.log(commandOptions.value);
      }
    });
    getSelectByType("device_log_path").then(res => {
      if (res.code === SUCCESS) {
        logPathOptions.value = res.data;
        console.log(logPathOptions.value);
      }
    });
    getSelectByType("device_log_custom").then(res => {
      if (res.code === SUCCESS) {
        regularExpression.value = res.data;
        console.log(regularExpression.value);
      }
    });
    if (!commandFormRef) return;
    commandFormRef.clearValidate();
  }

  const handleCommandSubmit = async (
    commandFormRef: FormInstance | undefined
  ) => {
    if (!commandFormRef) return;
    await commandFormRef.validate((valid, fields) => {
      if (valid) {
        console.log(commandForm.value);
        let params = {};
        if (commandForm.value.type === "日志") {
          // 处理日志类的指令
          if (!checkLogPath()) {
            return;
          }
          params = {
            type: "reportLog",
            data: {
              fileName: commandForm.value.logPath
            }
          };
        } else {
          // 处理其他类型
          let paramType = "command";
          if (commandForm.value.lable === "心跳时间") {
            // 心跳包
            paramType = "heartbeat";
          }
          if (!commandForm.value.content) {
            commandForm.value.content = commandForm.value.type;
          }
          params = {
            type: paramType,
            data: {
              cmd: commandForm.value.content
            }
          };
        }
        oBusPushCommand(commandForm.value.deviceId, params).then(res => {
          if (res.code === SUCCESS) {
            message("下发成功", { type: "success" });
          } else {
            message(res.msg, { type: "error" });
          }
        });
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  function handlerChangeType(value) {
    const selectedItem = commandOptions.value.find(
      item => item.value === value
    );
    commandForm.value.lable = selectedItem ? selectedItem.label : "";
  }

  function checkLogPath() {
    if (
      commandForm.value.type === "日志" &&
      commandForm.value.logPath === "customize"
    ) {
      // 自定义指令
      let reg = regularExpression.value;
      if (reg.length > 0) {
        for (let i = 0; i < reg.length; i++) {
          if (reg[i].value === "") {
            message("请填写正则表达式", { type: "error" });
            return false;
          }
          try {
            const regex = new RegExp(reg[i].value);
            if (!regex.test(commandForm.value.content)) {
              message(`内容不满足正则表达式: ${reg[i].value}`, {
                type: "error"
              });
              return false;
            } else {
              return true;
            }
          } catch (e) {
            message("正则表达式无效", { type: "error" });
            return false;
          }
        }
      }
    } else {
      return true;
    }
  }

  function handleCommTime(row) {
    console.log("handleCommTime", row);
    dialogDeviceOnOrLineVisible.value = true;
    getHistoryOnOrOffine(row.deviceId).then(res => {
      if (res.code === SUCCESS) {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          activities.value.push({
            content: res.data[i].status,
            timestamp: res.data[i].createTime,
            icon: markRaw(
              useRenderFlicker({
                background:
                  res.data[i].status === "在线状态" ? "#67C23A" : "#E6A23C"
              })
            )
          });
        }
      }
    });
  }

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
    commandForm,
    buttonClass,
    moreCondition,
    expandRowKeys,
    dialogFormVisible,
    dialogShellVisible,
    dialogShellLoginVisible,
    dialogHardWareVisible,
    dialogSysStatusVisible,
    dialogDeviceOnOrLineVisible,
    dialogCommandVisible,
    dialogSoftInfoVisible,
    hardwareInfo,
    memNumber,
    memColor,
    diskNumber,
    diskColor,
    cpuPercent,
    cpuHistory,
    memHistory,
    diskHistory,
    activities,
    commandOptions,
    logPathOptions,
    CommonCommandOptions,
    rulesCommand,
    softwareInfoJArray,
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
    handleDialogSysStem,
    handleDialogSlot,
    handleShallLogin,
    handleDialogClosed,
    handleDialogHardWareInfo,
    handleDialogInfoClose,
    handleExpandChange,
    handleCommandSubmit,
    handlerChangeType,
    checkLogPath,
    downCommand,
    cancel,
    restartForm,
    openDia
  };
}
