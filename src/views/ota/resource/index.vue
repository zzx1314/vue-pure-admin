<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { FormInstance, genFileId, UploadFile, UploadFiles } from "element-plus";
import { useResource } from "@/views/ota/resource/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Position from "@iconify-icons/ep/position";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import pLimit from "p-limit";
import { CHUNK_SIZE } from "@/constants";
import { convertFileSizeUnit } from "@/lib/fileUtil";
import cutFile from "@/lib/cutFile";
import { MerkleTree } from "@/lib/MerkleTree";
import { checkFileByMd5, initMultPartFile, mergeFileByMd5 } from "@/api/system";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { resSave, resUpdate } from "@/api/otaRes";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";

defineOptions({
  name: "Resource"
});

const formRef = ref();
const addFormRef = ref<FormInstance>();

const {
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  dialogFormVisible,
  title,
  addForm,
  rules,
  addType,
  updateType,
  moreCondition,
  devOption,
  resOsList,
  fileList,
  typeOption,
  cancel,
  openDia,
  onSearch,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  restartForm
} = useResource();

const uploadRef = ref<UploadInstance>(null);
const uploadFileTemp = ref<UploadFile>(null);

const limit = pLimit(3);
const HttpCodeUploadEnum = {
  SUCCESS: 2001,
  UPLOADING: 2002,
  NOT_UPLOAD: 2003,
  FAIL: 5001
};

const state = reactive({
  dataSource: []
});

// 选择文件并计算 md5
const selectFile = async option => {
  // console.log(option)
  // return;
  // let fileItem=option.raw
  const file = option.file;
  if (!file) return;

  const chunkCount = Math.ceil((file.size ?? 0) / CHUNK_SIZE);
  // 展示给 table的数据，部分参数用于初始化
  const dataItem = {
    uid: file.uid,
    name: file.name,
    size: file.size ?? 0,
    unitSize: convertFileSizeUnit(file.size),
    md5: "",
    md5Progress: 0,
    progress: 0,
    chunkCount,
    file: file,
    status: "preparation",
    chunkFileList: [],
    uploadedSize: 0
  };
  state.dataSource.push(dataItem);
  const i = state.dataSource.findIndex(item => item.uid == dataItem.uid);
  // 同步计算分片文件和 md5，实时更新计算进度
  // const { md5, chunkFileList } = await createChunkFileAndMd5(
  //   file as RcFile,
  //   chunkCount,
  //   (progress) => {
  //     state.dataSource[i].md5Progress = progress
  //   },
  // )

  // 采用多线程计算和默克尔树计算树根
  const chunks = await cutFile(file);
  const merkleTree = new MerkleTree(chunks.map(chunk => chunk.hash));
  const md5 = merkleTree.getRootHash();
  const chunkFileList = chunks.map(chunk => chunk.blob);
  // console.log(md5, chunkFileList)

  // 更新数据和状态
  state.dataSource[i] = {
    ...state.dataSource[i],
    md5,
    chunkFileList,
    status: "preupload"
  };
  console.log("执行成功");
};

// 查询文件状态并上传
const onUpload = async option => {
  await selectFile(option);

  for (let i = 0; i < state.dataSource.length; i++) {
    console.log("循环" + i);
    // md5 未计算完成和正在上传的跳过（重复点击的情况）
    if (!state.dataSource[i].md5 || state.dataSource[i].status == "uploading")
      continue;

    await uploadFile(i, state.dataSource[i]);
  }
};

/**
 * 上传处理方法
 * @param index 如果直接修改 item，在上传过程中，item一直在被更改，而循环传入的 item 却一直是初始值，因此需要 index 确定当前 item 的最新值
 * @param item
 */
const uploadFile = async (index, item) => {
  const result = await checkFileByMd5(item.md5);
  console.log(result);
  const data = result.data;
  state.dataSource[index].status = "uploading";
  const code = result.code;
  if (code === HttpCodeUploadEnum.SUCCESS) {
    //  上传成功
    state.dataSource[index].progress = 100;
    state.dataSource[index].status = "success";
    message("上传成功", { type: "success" });
    cancel();
    return;
  } else if (code === HttpCodeUploadEnum.FAIL) {
    //  上传失败
    state.dataSource[index].status = "error";
    message("上传失败", { type: "error" });
    cancel();
    return;
  } /*  else if (code === HttpCodeUploadEnum.UPLOADING) {
        // 上传中，返回已上传的文件数据和分片列表
      } else {
        // 未上传
      } */

  // 返回需要上传分片和对应地址
  const needUploadFile = await initSliceFile(item, data);
  console.log("需要上传的文件", needUploadFile);
  const totalSize = needUploadFile.reduce((pre, cur) => pre + cur.file.size, 0);

  // plimit 并发上传
  const uploadLimit = needUploadFile.map(n =>
    limit(() => uploadChunkUrl(n, index, totalSize, item.file.type))
  );

  const results = await Promise.allSettled(uploadLimit);
  console.log("结果：", results);
  const errResults = results.filter(r => r.status === "rejected");

  if (errResults.length > 0) {
    console.warn(item.name + " 上传失败的分片-----", errResults);
    state.dataSource[index].status = "error";
    return;
  }

  try {
    const result = await mergeFileByMd5(item.md5);
    console.log("合并结果", result);
    const data = result.data;
    const code = result.code;
    if (code === 200) {
      console.log(data);
      state.dataSource[index].status = "success";
      state.dataSource[index].progress = 100;
      message("上传成功", { type: "success" });
      cancel();
    }
  } catch (error) {
    state.dataSource[index].status = "error";
    message("上传失败", { type: "error" });
  }
};

// 初始化分片操作并将分片文件和其上传地址一一对应
const initSliceFile = async (item, initData) => {
  //  只有上传中的分片文件才会有 initData 数据，用 {} 做兜底
  const { uploadId, listParts } = initData || {};

  // 初始化分片参数
  const param = {
    uploadId,
    originFileName: item.name,
    size: item.size,
    chunkSize: CHUNK_SIZE,
    chunkCount: item.chunkCount,
    md5: item.md5,
    contentType: item.file.type,
    businessStr: JSON.stringify(addForm.value)
  };

  const needUploadFile = [];

  const result = await initMultPartFile(param);
  console.log("初始化分片结果", result);
  const code = result.code;
  const data = result.data;
  if (code !== 10200) return [];

  // 存放需要去上传的文件数据
  if ((listParts || []).length == 0) {
    // 若全都没有上传，一一对应，其中 urls 是所有分片上传的 url 集合
    item.chunkFileList.forEach((item, index) => {
      needUploadFile.push({ url: data.urls[index], file: item });
    });
    return needUploadFile;
  }

  // 存在上传的，对比 minio 已上传的 listParts（序号），将已上传的过滤掉，只上传未上传的文件
  item.chunkFileList.forEach((item, index) => {
    // listParts 索引是从 1 开始的
    const i = (listParts || []).findIndex(v => index + 1 == v);
    if (i === -1) {
      needUploadFile.push({ url: data.urls[index], file: item });
    }
  });

  return needUploadFile;
};

// 根据分片上传地址将分片直传至 minio
const uploadChunkUrl = (
  chunkItem: any,
  i: number,
  totalSize: number,
  type: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .put(chunkItem.url, chunkItem.file, {
        headers: { "Content-Type": type || "application/octet-stream" }
      })
      .then(res => {
        if (res.status !== 200) {
          reject(chunkItem);
        } else {
          // 已上传的文件大小更新，上传进度更新
          const newUploaedSize =
            state.dataSource[i].uploadedSize + chunkItem.file.size;
          state.dataSource[i] = {
            ...state.dataSource[i],
            uploadedSize: newUploaedSize,
            progress: Math.floor((newUploaedSize / totalSize) * 100)
          };
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        reject(chunkItem);
      });
  });
};

const submitUpload = () => {
  if (uploadFileTemp.value !== null) {
    uploadRef.value.submit();
  } else {
    message("请先上传文件", { type: "error" });
  }
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

// 保存
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(addForm.value);
      if (addForm.value.id) {
        // 修改
        console.log("修改资源");
        resUpdate(addForm.value).then(res => {
          if (res.code === SUCCESS) {
            message("修改成功！", { type: "success" });
            cancel();
          } else {
            message(res.msg, { type: "error" });
          }
        });
      } else {
        // 新增
        addForm.value.type =
          addType.value == "addSoftware" ? "操作系统" : "模块";
        addForm.value.parentId =
          addForm.value.parentId == null ? 0 : addForm.value.parentId;
        addForm.value.level = addForm.value.parentId == 0 ? 1 : 2;
        if (addForm.value.type == "模块") {
          submitUpload();
        } else {
          resSave(addForm.value).then(res => {
            if (res.code === SUCCESS) {
              message("保存成功！", { type: "success" });
              cancel();
            } else {
              message(res.msg, { type: "error" });
            }
          });
        }
        console.log("新增资源");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const beforeUpload = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log("上传文件前。。", uploadFile, uploadFiles);
  uploadFileTemp.value = uploadFile;
};
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="操作系统：" prop="softwareName">
        <el-input
          v-model="queryForm.softwareName"
          placeholder="请输入操作系统名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="操作系统版本：" prop="softwareVersion">
        <el-input
          v-model="queryForm.softwareVersion"
          placeholder="请输入系统版本名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="类型：" prop="devType">
        <el-select
          v-model="queryForm.type"
          placeholder="选择设备类型"
          style="width: 200px"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="设备类型：" prop="devType">
            <el-select
              v-model="queryForm.devType"
              placeholder="选择设备类型"
              style="width: 200px"
            >
              <el-option
                v-for="item in devOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组件包名称：" prop="pkgName">
            <el-input
              v-model="queryForm.pkgName"
              placeholder="请输入组件包名称"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="组件包版本：" prop="version">
            <el-input
              v-model="queryForm.version"
              placeholder="请输入组件包版本"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </div>
      </el-collapse-transition>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="restartForm(formRef)">
          重置
        </el-button>

        <el-button
          type="text"
          @click="moreCondition = !moreCondition"
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="资源列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加操作系统', addFormRef)"
        >
          添加操作系统
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加模块', addFormRef)"
        >
          添加模块
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Position)"
          @click="openDia('推送资源')"
        >
          推送
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog v-model="dialogFormVisible" :title="title" width="60%">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item
          label="操作系统名称"
          prop="softwareName"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.softwareName"
            placeholder="请输入软件名称"
          />
        </el-form-item>

        <el-form-item
          label="操作系统版本"
          prop="softwareVersion"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.softwareVersion"
            placeholder="请输入操作系统版本"
          />
        </el-form-item>

        <el-form-item
          label="设备类型"
          prop="devType"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-select
            v-model="addForm.value.devType"
            placeholder="选择设备类型"
            style="width: 200px"
          >
            <el-option
              v-for="item in devOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="模块包名称"
          prop="pkgName"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.pkgName"
            placeholder="请输入模块包名称"
          />
        </el-form-item>

        <el-form-item
          label="模块版本"
          prop="version"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.version"
            placeholder="请输入模块包类型"
          />
        </el-form-item>

        <el-form-item
          label="操作系统"
          prop="parentId"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-select
            v-model="addForm.value.parentId"
            placeholder="请选择所属操作系统"
            style="width: 200px"
          >
            <el-option
              v-for="item in resOsList"
              :key="item.id"
              :label="item.softwareName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="上传文件"
          prop="file"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-upload
            v-model:file-list="fileList"
            ref="uploadRef"
            :http-request="onUpload"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="beforeUpload"
          >
            <template #trigger>
              <el-button
                :icon="useRenderIcon(Search)"
                type="primary"
                style="margin-right: 10px"
                >选取文件</el-button
              >
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitForm(addFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
