<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { pSysMessageUpdate } from "@/api/pSysMessage";
import { message } from "@/utils/message";
import { SUCCESS } from "@/api/base";
import { useMessageStoreHook } from "@/store/modules/message";

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  id: {
    type: Number,
    default: null
  }
});
const emit = defineEmits(["update:dialogFormVisible"]);

const addFormRef = ref();
const addForm = ref({
  handleMessage: ""
});

onMounted(() => {});

function resetForm(formEl) {
  if (!formEl) return;
  nextTick(() => {
    formEl.resetFields();
  });
}

function closeDialog() {
  emit("update:dialogFormVisible", false);
}

const cancel = formEl => {
  clearForm();
  resetForm(formEl);
  closeDialog();
};

function clearForm() {
  addForm.value = {
    handleMessage: ""
  };
}

const addFormInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let param = {
        ...addForm.value,
        id: props.id
      };
      pSysMessageUpdate(param).then(res => {
        if (res.code === SUCCESS) {
          message("处置成功！", { type: "success" });
          clearForm();
          resetForm(formEl);
          closeDialog();
          useMessageStoreHook().setHandleMessage(true);
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      console.log("error!", fields);
    }
  });
};

const rules = {
  handleMessage: [{ required: true, message: "处置内容必填", trigger: "blur" }]
};
</script>

<template>
  <div>
    <el-dialog
      :model-value="dialogFormVisible"
      :title="title"
      width="500px"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="处置内容" prop="handleMessage">
          <el-input
            v-model="addForm.handleMessage"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
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
