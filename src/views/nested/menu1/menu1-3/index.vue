<script setup lang="ts">
import { ref } from "vue";
import FileTable from "./FileTable.vue";
import UploadModal from "./UploadModal.vue";

defineOptions({
  name: "Menu1-3"
});

const visible = ref(false);
</script>

<template>
  <div style="margin-bottom: 20px; text-align: left">
    <el-button type="primary" @click="visible = true">上传文件</el-button>
    <FileTable />
    <UploadModal :visible="visible" />
  </div>
</template>
