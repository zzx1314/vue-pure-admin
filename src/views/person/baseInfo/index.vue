<script setup lang="ts">
import {
  ElLoading,
  FormInstance,
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from "element-plus";
import { usePerson } from "@/views/person/baseInfo/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import FileDown from "@iconify-icons/ri/file-download-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import FilePdfLine from "@iconify-icons/ri/file-pdf-line";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ri/arrow-down-double-line";
import DownLine from "@iconify-icons/ri/download-line";
import Up from "@iconify-icons/ri/arrow-up-double-line";
import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { personUpload } from "@/api/person";
import { message } from "@/utils/message";
import { SUCCESS } from "@/api/base";
import Pdf from "@/components/RePdf/pdf.vue";
import PureTable from "@pureadmin/table";
import More from "@iconify-icons/ep/more-filled";

const formRef = ref();
const addFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>(null);

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
  moreCondition,
  dialogUpload,
  dialogView,
  viewUrl,
  fileList,
  isLdapAuth,
  openUploadDia,
  exportExcel,
  cancel,
  restartForm,
  submitForm,
  onSearch,
  handleUpdate,
  handleView,
  handleDown,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = usePerson();

// 查询文件状态并上传
const onUpload = async option => {
  const loading = ElLoading.service({
    lock: true,
    text: "上传中",
    background: "rgba(0, 0, 0, 0.7)"
  });
  await personUpload(option.file).then(res => {
    if (res.code == SUCCESS) {
      message("上传成功！", { type: "success" });
      // 从FileList中找到文件修改状态
      const file = fileList.value.find(item => item.name === option.file.name);
      file.status = "success";
      cancel();
    } else {
      message("上传失败", { type: "error" });
    }
  });
  loading.close();
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

const selectFolder = () => {
  // 创建隐藏的 input 元素用于选择文件夹
  const input = document.createElement("input");
  input.type = "file";
  input.webkitdirectory = true; // 注意，此属性在某些浏览器中可能不受支持
  input.multiple = true;
  input.onchange = e => handleFiles(e.target.files);
  input.click();
};

const handleFiles = async files => {
  for (const file of files) {
    fileList.value.push({
      name: file.name,
      percentage: 0,
      status: "ready",
      raw: file,
      size: file.size
    });
  }
};
const submitUpload = () => {
  console.log("提交代码");
  uploadRef.value.submit();
};

defineOptions({
  name: "person"
});
</script>

<template>
  <div class="main">
    <div v-if="isLdapAuth">
      <p>当前用户没有权限，请联系管理员，授权</p>
    </div>
    <div v-else>
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryForm"
        class="bg-bg_color w-[99/100] pl-8 pt-4"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="queryForm.name"
            placeholder="请输入姓名"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="queryForm.sex"
            placeholder="请输入性别"
            class="!w-[150px]"
          >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input
            v-model="queryForm.age"
            placeholder="请输入年龄"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="mailbox">
          <el-input
            v-model="queryForm.mailbox"
            placeholder="请输入邮箱"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="queryForm.phone"
            placeholder="请输入电话"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>

        <el-collapse-transition>
          <div v-show="moreCondition">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryForm.status"
                placeholder="请输入状态"
                class="!w-[150px]"
              >
                <el-option label="待面试" value="待面试" />
                <el-option label="已面试" value="已面试" />
              </el-select>
            </el-form-item>
            <el-form-item label="面试结果" prop="interviewResult">
              <el-select
                v-model="queryForm.interviewResult"
                placeholder="请输入面试结果"
                class="!w-[150px]"
              >
                <el-option label="通过" value="通过" />
                <el-option label="未通过" value="未通过" />
                <el-option label="待定" value="未通过" />
              </el-select>
            </el-form-item>
            <el-form-item label="一面评价" prop="interviewAssess">
              <el-input
                v-model="queryForm.interviewAssess"
                placeholder="请输入面试评价"
                clearable
                class="!w-[150px]"
              />
            </el-form-item>
            <el-form-item label="二面评价" prop="interviewAssess">
              <el-input
                v-model="queryForm.interviewAssessTwo"
                placeholder="请输入面试评价"
                clearable
                class="!w-[150px]"
              />
            </el-form-item>
            <el-form-item label="技术栈" prop="technologyStack">
              <el-input
                v-model="queryForm.technologyStack"
                placeholder="技术栈"
                clearable
                class="!w-[150px]"
              />
            </el-form-item>
            <el-form-item label="开始时间：" prop="beginTime">
              <el-date-picker
                v-model="queryForm.beginTime"
                type="date"
                placeholder="请输入开始时间"
                class="!w-[150px]"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
              <el-date-picker
                v-model="queryForm.endTime"
                placeholder="请输入结束时间"
                type="date"
                class="!w-[150px]"
                value-format="YYYY-MM-DD"
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
          <el-button
            :icon="useRenderIcon(Refresh)"
            @click="restartForm(formRef)"
          >
            重置
          </el-button>
          <el-button
            type="text"
            style="font-size: large"
            :icon="moreCondition ? useRenderIcon(Up) : useRenderIcon(Down)"
            @click="moreCondition = !moreCondition"
          />
        </el-form-item>
      </el-form>

      <PureTableBar title="候选人列表" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openUploadDia()"
          >
            上传
          </el-button>
          <el-button
            color="#626aef"
            :icon="useRenderIcon(FileDown)"
            @click="exportExcel()"
          >
            导出
          </el-button>
        </template>
        <template v-slot="{ size, checkList, dynamicColumns }">
          <pure-table
            border
            adaptive
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
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
                @click="handleUpdate(row, addFormRef)"
              >
                修改
              </el-button>
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(FilePdfLine)"
                @click="handleView(row)"
              >
                预览
              </el-button>

              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        class="reset-margin"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(DownLine)"
                        @click="handleDown(row)"
                      >
                        下载
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-popconfirm
                        title="是否确认删除?"
                        @confirm="handleDelete(row)"
                      >
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
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>

    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.value.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="addForm.value.sex" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addForm.value.age" placeholder="请输入CA名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mailbox">
          <el-input v-model="addForm.value.mailbox" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.value.phone" placeholder="请输入电话号" />
        </el-form-item>
        <el-form-item label="大学" prop="university">
          <el-input
            v-model="addForm.value.university"
            placeholder="请输入大学"
          />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="addForm.value.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="入学时间" prop="enrolYear">
          <el-input
            v-model="addForm.value.enrolYear"
            placeholder="请输入入学时间"
          />
        </el-form-item>
        <el-form-item label="入学经历" prop="enrolExperience">
          <el-input
            v-model="addForm.value.enrolExperience"
            placeholder="请输入入学经历"
          />
        </el-form-item>
        <el-form-item label="工作经历" prop="enrolExperience">
          <el-input
            v-model="addForm.value.workExperience"
            placeholder="请输入工作经历"
          />
        </el-form-item>
        <el-form-item label="技术栈" prop="enrolExperience">
          <el-input
            v-model="addForm.value.technologyStack"
            placeholder="请输入技术栈"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.value.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="面试结果" prop="remark">
          <el-select
            v-model="addForm.value.interviewResult"
            placeholder="请输入面试结果"
            class="!w-[191px]"
          >
            <el-option label="通过" value="通过" />
            <el-option label="未通过" value="未通过" />
            <el-option label="待定" value="未通过" />
          </el-select>
        </el-form-item>
        <el-form-item label="一面评价" prop="remark">
          <el-input
            v-model="addForm.value.interviewAssessTwo"
            :rows="2"
            type="textarea"
            class="!w-[191px]"
            placeholder="请输入一面试评价"
          />
        </el-form-item>
        <el-form-item label="二面评价" prop="remark">
          <el-input
            v-model="addForm.value.interviewAssess"
            :rows="2"
            type="textarea"
            class="!w-[191px]"
            placeholder="请输入二面评价"
          />
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

    <el-dialog
      v-model="dialogUpload"
      title="上传简历"
      :close-on-click-modal="false"
    >
      <el-button type="primary" @click="selectFolder">选择文件夹</el-button>
      <el-button type="success" @click="submitUpload">开始上传</el-button>
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        :http-request="onUpload"
        :auto-upload="false"
        :multiple="true"
        accept=".pdf"
        class="upload-demo"
        drag
      >
        <el-icon class="el-icon--upload"
          ><upload-filled style="color: #0c5"
        /></el-icon>
        <div class="el-upload__text">拖拽上传 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">请上传pdf文件</div>
        </template>
      </el-upload>
    </el-dialog>

    <el-dialog v-model="dialogView" title="预览">
      <pdf :pdf-url="viewUrl" />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
