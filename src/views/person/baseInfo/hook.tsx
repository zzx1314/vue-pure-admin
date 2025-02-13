import { computed, onMounted, reactive, ref } from "vue";
import { utils, writeFile } from "xlsx";
import type { PaginationProps } from "@pureadmin/table";
import type { FormInstance, FormRules, UploadUserFile } from "element-plus";
import {
  personPage,
  personUpdate,
  personDelete,
  downPerson
} from "@/api/person";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { usePermissionStoreHook } from "@/store/modules/permission";

export function usePerson() {
  // ----变量定义-----
  const queryForm = reactive({
    name: "",
    sex: "",
    age: "",
    mailbox: "",
    phone: "",
    university: "",
    major: "",
    enrolYear: "",
    enrolExperience: "",
    workExperience: "",
    technologyStack: "",
    remark: "",
    beginTime: "",
    endTime: "",
    status: "",
    interviewResult: "",
    interviewAssess: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogFormVisible = ref(false);
  const dialogUpload = ref(false);
  const dialogView = ref(false);
  const viewUrl = ref("");
  const fileList = ref<UploadUserFile[]>();
  const title = ref("");
  const isLdapAuth = ref(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const addForm = reactive({
    value: {
      id: null,
      name: "",
      sex: "",
      age: null,
      mailbox: "",
      phone: "",
      university: "",
      major: "",
      enrolYear: "",
      enrolExperience: "",
      workExperience: "",
      technologyStack: "",
      remark: "",
      interviewResult: "",
      interviewAssess: ""
    }
  });
  const rules = reactive<FormRules>({
    name: [{ required: true, message: "姓名必填", trigger: "blur" }],
    sex: [{ required: true, message: "性别必填", trigger: "blur" }],
    age: [{ required: true, message: "年龄必填", trigger: "blur" }],
    mailbox: [{ required: true, message: "邮箱必填", trigger: "blur" }],
    phone: [{ required: true, message: "电话必填", trigger: "blur" }],
    university: [{ required: true, message: "大学必填", trigger: "blur" }],
    major: [{ required: true, message: "专业必填", trigger: "blur" }],
    enrolYear: [{ required: true, message: "入学时间必填", trigger: "blur" }],
    enrolExperience: [
      { required: true, message: "入学经历必填", trigger: "blur" }
    ],
    workExperience: [
      { required: true, message: "工作经历必填", trigger: "blur" }
    ],
    technologyStack: [
      { required: true, message: "技术栈必填", trigger: "blur" }
    ]
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
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-tag
          type={
            row.status === "已面试"
              ? "success"
              : row.status === "待面试"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </el-tag>
      )
    },
    {
      label: "面试结果",
      prop: "interviewResult",
      minWidth: 100
    },
    {
      label: "面试评价",
      prop: "interviewAssess",
      minWidth: 150
    },
    {
      label: "姓名",
      prop: "name",
      minWidth: 100
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 100
    },
    {
      label: "年龄",
      prop: "age",
      minWidth: 120
    },
    {
      label: "邮箱",
      prop: "mailbox",
      minWidth: 120
    },
    {
      label: "电话",
      prop: "phone",
      minWidth: 120
    },
    {
      label: "大学",
      prop: "university",
      minWidth: 120
    },
    {
      label: "专业",
      prop: "major",
      minWidth: 120
    },
    {
      label: "入学时间",
      prop: "enrolYear",
      minWidth: 120
    },
    {
      label: "入学经历",
      prop: "enrolExperience",
      minWidth: 120
    },
    {
      label: "工作经历",
      prop: "workExperience",
      minWidth: 120
    },
    {
      label: "技术栈",
      prop: "technologyStack",
      minWidth: 120
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime"
    },
    {
      label: "备注",
      minWidth: 180,
      prop: "remark"
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
    openDia("修改", formEl);
  }
  function handleView(row) {
    console.log(row);
    dialogView.value = true;
    viewUrl.value = row.previewUrl;
  }
  function handleDown(row) {
    downPerson(row);
  }
  // 删除
  function handleDelete(row) {
    console.log(row);
    personDelete(row.id).then(res => {
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
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
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
      ...queryForm
    };
    if (query.endTime) {
      query.endTime = query.endTime + " 23:59:59";
    }
    const { data } = await personPage(query);
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
    onSearch();
  };
  // 取消
  function cancel() {
    addForm.value = {
      id: null,
      name: "",
      sex: "",
      age: null,
      mailbox: "",
      phone: "",
      university: "",
      major: "",
      enrolYear: "",
      enrolExperience: "",
      workExperience: "",
      technologyStack: "",
      remark: "",
      interviewResult: "",
      interviewAssess: ""
    };
    queryForm.name = "";
    queryForm.sex = "";
    queryForm.age = "";
    queryForm.mailbox = "";
    queryForm.phone = "";
    queryForm.university = "";
    queryForm.major = "";
    queryForm.enrolExperience = "";
    queryForm.workExperience = "";
    queryForm.technologyStack = "";
    queryForm.remark = "";
    queryForm.enrolYear = "";
    queryForm.beginTime = "";
    queryForm.endTime = "";
    queryForm.status = "";
    queryForm.interviewResult = "";
    queryForm.interviewAssess = "";
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
          console.log("修改信息");
          personUpdate(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
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
  function openDia(param, formEl?) {
    dialogFormVisible.value = true;
    title.value = param;
    resetForm(formEl);
  }

  function openUploadDia() {
    dialogUpload.value = true;
    fileList.value = [];
  }
  // 导出
  const exportExcel = () => {
    const res = dataList.value.map(item => {
      const arr = [];
      columns.forEach(column => {
        if (
          column.label &&
          column.label !== "操作" &&
          column.label !== "序号" &&
          column.label !== ""
        ) {
          arr.push(item[column.prop as string]);
        }
      });
      return arr;
    });
    const titleList = [];
    columns.forEach(column => {
      if (
        column.label &&
        column.label !== "操作" &&
        column.label !== "序号" &&
        column.label !== ""
      ) {
        titleList.push(column.label);
      }
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, "数据报表");
    writeFile(workBook, "候选人信息.xlsx");
    message("导出成功", {
      type: "success"
    });
  };

  onMounted(() => {
    onSearch();
    const wholeMenus = usePermissionStoreHook().wholeMenus;
    console.log("当前用户有的菜单", wholeMenus);
    if (wholeMenus.length === 1) {
      isLdapAuth.value = true;
    }
  });

  return {
    queryForm,
    dataList,
    loading,
    dialogFormVisible,
    dialogUpload,
    dialogView,
    viewUrl,
    title,
    pagination,
    addForm,
    rules,
    moreCondition,
    columns,
    status,
    buttonClass,
    fileList,
    isLdapAuth,
    openUploadDia,
    onSearch,
    resetForm,
    handleUpdate,
    handleView,
    handleDown,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancel,
    restartForm,
    submitForm,
    openDia,
    exportExcel
  };
}
