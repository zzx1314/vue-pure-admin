<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance } from "element-plus";

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

function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

const cancel = formEl => {
  addForm.value = {
    id: null,
    password: "",
    newpassword: "",
    newpassword1: ""
  };
  resetForm(formEl);
  emit("update:dialogFormVisible", false);
};

const addFormInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("修改密码");
      emit("update:dialogFormVisible", false);
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

const rules = {
  password: [{ required: true, message: "密码必填", trigger: "blur" }],
  newpassword: [
    { validator: validatePass, trigger: "blur" },
    { required: true, message: "密码必填", trigger: "blur" }
  ],
  newpassword1: [
    { validator: validatePass2, trigger: "blur" },
    { required: true, message: "密码必填", trigger: "blur" }
  ]
};
</script>

<template>
  <div>
    <el-dialog
      :model-value="dialogFormVisible"
      title="用户信息"
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
        <el-form-item label="密码" prop="newpassword">
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
