import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules } from "element-plus";
import {
  licenseBusDeviceSave,
  licenseBusDevicePage,
  licenseBusDeviceUpdate,
  licenseBusDeviceDelete
} from "@/api/licenseBusDevice";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useLicenseBusDevice() {
  // ----变量定义-----
  const queryForm = reactive({
    projName: "",
    userName: "",
    activationCode: "",
    osVersion: "",
    processArch: "",
    cerStatus: "",
    endTime: "",
    beginTime: ""
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
  const rules = reactive<FormRules>({});
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
      label: "项目名称",
      prop: "projName",
      minWidth: 150
    },
    {
      label: "项目编码",
      prop: "projCode",
      minWidth: 150
    },
    {
      label: "激活用户",
      prop: "username",
      minWidth: 100
    },
    {
      label: "状态",
      prop: "cerStatus",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <el-tag type={row.cerStatus === "已激活" ? "success" : "danger"}>
          {row.cerStatus}
        </el-tag>
      )
    },
    {
      label: "设备ID",
      prop: "activationCode",
      minWidth: 200
    },
    {
      label: "设备类型",
      prop: "productName",
      minWidth: 100
    },
    {
      label: "系统版本",
      prop: "osVersion",
      minWidth: 100
    },
    {
      label: "系统架构",
      prop: "processArch",
      minWidth: 100
    },
    {
      label: "证书有效期限",
      prop: "cerFailureTime",
      minWidth: 150
    },
    {
      label: "校验时间",
      prop: "commTime",
      minWidth: 150
    },
    {
      label: "激活时间",
      prop: "activationTime",
      minWidth: 150
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
    licenseBusDeviceDelete(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  // -------查询------
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
  async function onSearch() {
    loading.value = true;
    console.log("查询信息");
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
    const { data } = await licenseBusDevicePage(query);
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
    queryForm.projName = "";
    queryForm.userName = "";
    queryForm.activationCode = "";
    queryForm.osVersion = "";
    queryForm.processArch = "";
    queryForm.cerStatus = "";
    queryForm.beginTime = "";
    queryForm.endTime = "";
    dialogFormVisible.value = false;
    onSearch();
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        if (addForm.value.id) {
          // 修改
          console.log("修改");
          licenseBusDeviceUpdate(addForm.value).then(res => {
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
          licenseBusDeviceSave(addForm.value).then(res => {
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
    cancel,
    restartForm,
    submitForm,
    openDia
  };
}
