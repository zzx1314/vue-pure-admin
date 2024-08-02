<template>
  <el-table :data="state.dataSource">
    <el-table-column label="ID" prop="id" />
    <el-table-column
      label="原文件名"
      prop="originFileName"
      show-overflow-tooltip
    />
    <el-table-column label="object" prop="object" show-overflow-tooltip />
    <el-table-column label="文件大小" prop="size" width="120">
      <template #default="scope">
        {{ convertFileSizeUnit(scope.row.size) }}
      </template>
    </el-table-column>
    <el-table-column label="下载进度" prop="progress">
      <template #default="scope">
        <el-progress
          v-if="scope.row.progress"
          :percentage="scope.row.progress"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="status" width="120">
      <template #default="scope">
        <template
          v-if="scope.row.status === undefined || scope.row.status === 'error'"
        >
          <el-button
            :icon="useRenderIcon(Down)"
            type="primary"
            @click="downloadFile(scope.row)"
          />
        </template>
        <template v-else>
          <!-- 暂停 -->
          <el-button
            v-if="scope.row.status === 'downloading'"
            type="primary"
            :icon="useRenderIcon(VideoPause)"
            @click="puaseDownload(scope.row)"
          />
          <!-- 继续下载 -->
          <el-button
            v-else
            icon="VideoPlay"
            type="primary"
            @click="downloadFile(scope.row)"
          />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { convertFileSizeUnit, downloadFileByBlob } from "./fileUtil";
import { CHUNK_SIZE } from "@/constants";
import { chunkDownloadFile, fetchFileList } from "@/api/system";
import Down from "@iconify-icons/ep/download";
import VideoPause from "@iconify-icons/ep/video-pause";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const state = reactive({
  dataSource: [],
  blobRef: new Map<number, BlobPart[]>()
});

onMounted(async () => {
  const { data } = await fetchFileList();
  state.dataSource = data;
});
// 分片下载文件
const downloadFile = async record => {
  const index = state.dataSource.findIndex(item => item.id === record.id);
  state.dataSource[index].status = "downloading";

  const totalChunks = Math.ceil(record.size / CHUNK_SIZE); // 请求次数，可自定义调整分片大小，这里默认了上传分片大小
  // 如果是暂停，根据已下载的，找到断点，偏移长度进行下载
  const offset = state.blobRef.get(record.id)?.length || 0;
  console.log("totalChunks" + totalChunks);
  console.log("offset" + offset);
  for (let i = offset + 1; i <= totalChunks; i++) {
    // 暂停/错误 终止后续请求
    if (state.dataSource[index].status !== "downloading") return;

    const start = CHUNK_SIZE * (i - 1);
    let end = CHUNK_SIZE * i - 1;
    if (end > record.size) end = record.size; // 虽然超出不会影响内容读取，但是会影响进度条的展示

    try {
      console.log("调用接口", start, end);
      const query = {
        id: record.id,
        range: `bytes=${start}-${end}`
      };
      const res = await chunkDownloadFile(query);
      const currentDataBlob = state.blobRef.get(record.id) || [];
      // 记录当前数据的分片 blob
      state.blobRef.set(record.id, [
        ...currentDataBlob,
        res as unknown as BlobPart
      ]);
      state.dataSource[index].progress = Math.floor((end / record.size) * 100);
    } catch (error) {
      state.dataSource[index].status = "error";
      return;
    }
  }

  state.dataSource[index].status = undefined; // 重置状态
  state.dataSource[index].progress = undefined; // 重置进度条
  const blob = new Blob(state.blobRef.get(record.id));
  downloadFileByBlob(blob, record.originFileName);
};

// 暂停下载
const puaseDownload = record => {
  record.status = "pause";
};
</script>
