import { message } from "@/utils/message";
import { handleTree } from "@/utils/tree";
import { reactive, ref, onMounted } from "vue";
import { getDeptList, saveSysOrg, updateById, removeById } from "@/api/system";
import { FormInstance, FormRules } from "element-plus";
import { SUCCESS } from "@/api/base";

export function useDept() {
  const addForm = reactive({
    value: {
      id: null,
      name: "",
      type: "",
      parentId: null,
      parentName: "",
      remarks: "",
      sort: 0
    }
  });

  const searchForm = reactive({
    name: ""
  });

  const dialogFormVisible = ref(false);
  const formLabelWidth = "140px";
  const title = ref("");
  const moreCondition = ref(false);
  const options = [
    {
      type: "top",
      name: "顶部门"
    },
    {
      type: "company",
      name: "单位"
    },
    {
      type: "common",
      name: "部门"
    }
  ];
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      minWidth: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "部门名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 70
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={
            row.type === "top"
              ? "success"
              : row.type === "company"
              ? "info"
              : "warning"
          }
          effect="plain"
        >
          {row.type === "top"
            ? "顶部门"
            : row.type === "company"
            ? "单位"
            : "部门"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createTime"
    },
    {
      label: "备注",
      prop: "remarks",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  const rules = reactive<FormRules>({
    name: [{ required: true, message: "名称必填", trigger: "blur" }],
    type: [{ required: true, message: "类型必填", trigger: "change" }],
    parentId: [{ required: true, message: "上级必填", trigger: "change" }]
  });

  // 类型
  function changeSelet() {
    if (addForm.value.type == "top") {
      addForm.value.parentId = null;
      addForm.value.parentName = "";
    }
  }

  // 修改
  function handleUpdate(row) {
    const orgInfo = JSON.stringify(row);
    openDia("修改组织");
    addForm.value = JSON.parse(orgInfo);
  }

  // 确认删除
  const confirmEvent = row => {
    console.log("confirm!", row);
    removeById(row.id).then(res => {
      if (res.code === SUCCESS) {
        message("删除成功！", { type: "success" });
        onSearch();
      }
    });
  };
  // 取消
  const cancelEvent = () => {
    console.log("cancel!");
  };

  // 多选
  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  function cancel(formEl) {
    addForm.value = {
      id: null,
      name: "",
      type: "",
      parentId: null,
      parentName: "",
      remarks: "",
      sort: 0
    };
    resetForm(formEl);
    dialogFormVisible.value = false;
  }

  function openDia(param) {
    title.value = param;
    dialogFormVisible.value = true;
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getDeptList(searchForm);
    dataList.value = handleTree(data);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(addForm.value);
        if (addForm.value.id) {
          updateById(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("修改成功！", { type: "success" });
              cancel(formEl);
            }
          });
        } else {
          saveSysOrg(addForm.value).then(res => {
            if (res.code == SUCCESS) {
              message("添加成功！", { type: "success" });
              cancel(formEl);
            }
          });
        }
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  onMounted(() => {
    onSearch();
  });

  return {
    addForm,
    searchForm,
    dialogFormVisible,
    formLabelWidth,
    options,
    loading,
    columns,
    dataList,
    rules,
    title,
    moreCondition,
    changeSelet,
    onSearch,
    resetForm,
    cancel,
    submitForm,
    openDia,
    handleUpdate,
    handleSelectionChange,
    confirmEvent,
    cancelEvent
  };
}
