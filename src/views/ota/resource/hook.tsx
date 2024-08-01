import { computed, onMounted, reactive, ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { FormInstance, FormRules } from "element-plus";
import { resPage, resSave } from "@/api/otaRes";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

export function useResource() {
  // ----变量定义-----
  const queryForm = reactive({
    name: "",
    code: "",
    status: ""
  });
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
      softwareName: "",
      softwareVersion: "",
      devType: "",
      type: "",
      pkgName: "",
      version: "",
      parentId: null,
      level: null
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

  // 定义添加类型
  const addType = ref("");

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
    const roleInfo = JSON.stringify(row);
    addForm.value = JSON.parse(roleInfo);
    openDia("修改资源");
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
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

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  // 取消
  function cancel(formEl) {
    addForm.value = {
      id: null,
      softwareName: "",
      softwareVersion: "",
      devType: "",
      type: "",
      pkgName: "",
      version: "",
      parentId: null,
      level: null
    };
    resetForm(formEl);
    dialogFormVisible.value = false;
  }
  // 保存
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        if (addForm.value.id) {
          // 修改
          console.log("修改资源");
        } else {
          // 新增
          addForm.value.type =
            addType.value == "addSoftware" ? "操作系统" : "模块";
          addForm.value.parentId =
            addForm.value.parentId == null ? 0 : addForm.value.parentId;
          addForm.value.level = addForm.value.parentId == 0 ? 1 : 2;
          resSave(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("保存成功！", { type: "success" });
              cancel(formEl);
            } else {
              message(res.msg, { type: "error" });
            }
          });
          console.log("新增资源");
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  // 打开弹框
  function openDia(param) {
    dialogFormVisible.value = true;
    title.value = param;
    if (param === "添加操作系统") {
      addType.value = "addSoftware";
    } else {
      addType.value = "addMode";
    }
    console.log(addType.value);
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
    addType,
    devOption,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    submitForm,
    openDia
  };
}
