<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";
import { http } from "@/utils/http";

const fileList = ref<UploadUserFile[]>([
  {
    name: "element-plus-logo.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg"
  },
  {
    name: "element-plus-logo2.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg"
  }
]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = uploadFile => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const handleChange: UploadProps["onChange"] = file => {
  console.log(file);
  http.getImageBase64(file.raw).then(res => {
    console.log(res);
  });
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFiles);
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

defineOptions({
  name: "Menu2"
});
</script>

<template>
  <div class="dark:text-white">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="#"
      multiple
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :auto-upload="false"
    >
      <el-button type="primary">Click to upload</el-button>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </el-upload>
  </div>
</template>
