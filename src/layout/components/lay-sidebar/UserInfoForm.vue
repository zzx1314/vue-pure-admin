<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { updatePassword } from "@/api/user";
import { SUCCESS } from "@/api/base";
import { DataInfo, userKey } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import aesUtils from "@/utils/aes";
import { getSafePolicy } from "@/api/system";

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["update:dialogFormVisible"]);

const addFormRef = ref();
const addForm = ref({
  id: null,
  password: "",
  newpassword: "",
  newpassword1: ""
});

const addFormRul = ref({
  type: "sys_security_policy",
  sysLoginMaxLockTime: "5分钟",
  sysLoginMaxTryCount: "5次",
  sysPassLength: 11,
  sysPassShortLength: 8,
  sysPassChange: "5天",
  sysOvertime: "30分钟",
  passCom: "密码是数字，字母组合"
});

const getSysSeting = () => {
  getSafePolicy().then(res => {
    if (res.code === SUCCESS) {
      addFormRul.value = res.data;
    }
  });
};

onMounted(() => {
  getSysSeting();
});

function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

function closeDialog() {
  emit("update:dialogFormVisible", false);
}

const cancel = formEl => {
  addForm.value = {
    id: null,
    password: "",
    newpassword: "",
    newpassword1: ""
  };
  resetForm(formEl);
  closeDialog();
};

const addFormInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("修改密码");
      addForm.value.password = aesUtils.encode(addForm.value.password, "");
      addForm.value.newpassword = aesUtils.encode(
        addForm.value.newpassword,
        ""
      );
      addForm.value.newpassword1 = aesUtils.encode(
        addForm.value.newpassword1,
        ""
      );
      addForm.value.id =
        storageLocal().getItem<DataInfo<number>>(userKey).user_id;
      console.log(addForm.value);
      updatePassword(addForm.value).then(res => {
        if (res.code === SUCCESS) {
          ElMessage.success("修改成功");
          closeDialog();
        } else {
          ElMessage.error("修改失败");
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 添加校验规则
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value !== addForm.value.newpassword) {
    callback(new Error("两次密码不一样"));
  } else {
    callback();
  }
};
// 对密码长度进行校验
const validatePass3 = (rule: any, value: any, callback: any) => {
  // sessionStorage 中获取密码长度
  const passMaxLengthStr = addFormRul.value.sysPassLength;
  const passMinLengthStr = addFormRul.value.sysPassShortLength;

  // 转换为整数
  const passMaxLength = parseInt(passMaxLengthStr, 10);
  const passMinLength = parseInt(passMinLengthStr, 10);

  if (value.length < passMinLength) {
    callback(new Error(`密码长度不能小于${passMinLength}位`));
  } else if (value.length > passMaxLength) {
    callback(new Error(`密码长度不能大于${passMaxLength}位`));
  } else {
    callback();
  }
};
// 对密码的复杂度进行校验
const validatePass4 = (rule: any, value: any, callback: any) => {
  // 从sessionStorage 中获取密码复杂度
  const passComplexityStr = addFormRul.value.passCom;
  if (passComplexityStr === "1") {
    // 密码是数字
    if (value.match(/^[0-9]+$/)) {
      callback();
    } else {
      callback(new Error("密码必须是数字"));
    }
  }
  if (passComplexityStr === "2") {
    // 密码是数字，字母组合
    if (value.match(/^[0-9a-zA-Z]+$/)) {
      callback();
    } else {
      callback(new Error("密码必须是数字，字母组合"));
    }
  }
  if (passComplexityStr === "3") {
    // 密码是数字，字母，特殊字符组合
    if (value.match(/^[0-9a-zA-Z\W]+$/)) {
      callback();
    } else {
      callback(new Error("密码必须是数字，字母，特殊字符组合"));
    }
  }
};

const rules = {
  password: [{ required: true, message: "密码必填", trigger: "blur" }],
  newpassword: [
    { validator: validatePass, trigger: "blur" },
    { validator: validatePass3, trigger: "blur" },
    { validator: validatePass4, trigger: "blur" },
    { required: true, message: "密码必填", trigger: "blur" }
  ],
  newpassword1: [
    { validator: validatePass2, trigger: "blur" },
    { validator: validatePass3, trigger: "blur" },
    { validator: validatePass4, trigger: "blur" },
    { required: true, message: "密码必填", trigger: "blur" }
  ]
};
</script>

<template>
  <div>
    <el-dialog
      :model-value="dialogFormVisible"
      title="密码修改"
      width="40%"
      @close="cancel(addFormRef)"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="password">
          <el-input v-model="addForm.password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="addForm.newpassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword1">
          <el-input v-model="addForm.newpassword1" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel(addFormRef)">取消</el-button>
          <el-button type="primary" @click="addFormInfo(addFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
