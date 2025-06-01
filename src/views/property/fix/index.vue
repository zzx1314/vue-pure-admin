<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { usePropertyBusFix } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Download from "@iconify-icons/ep/download";
import Upload from "@iconify-icons/ep/upload";
import More from "@iconify-icons/ep/more-filled";
import {distribute} from "@/api/propertyBusFix";

defineOptions({
  name: "PropertyBusFix"
});

const addFormRef = ref<FormInstance>();
const { columnsQueryForm } = useCollectorBusDevForm();

const uploadRef = ref();

const onUpload = async option => {
  const file = option.file;
  handlerImportExcel(file);
  // 上传完成后清除文件列表
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};
const {
  queryForm,
  dataList,
  loading,
  dialogFormVisible,
  title,
  pagination,
  addForm,
  columnsForm,
  rules,
  columns,
  onSearch,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSubmitError,
  handleSubmit,
  handlerDownloadTemplate,
  handlerImportExcel,
  handlerDownloadData,
  handlerDistributeProperty,
  cancel,
  openDia
} = usePropertyBusFix();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="4"
        label-width="60px"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      />
    </el-card>
    <PureTableBar title="固定资产列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增', addFormRef)"
        >
          新增
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Download)"
          @click="handlerDownloadTemplate"
        >
          下载模板
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Download)"
          @click="handlerDownloadData"
        >
          导出数据
        </el-button>
        <div class="ml-3">
          <el-upload
            ref="uploadRef"
            :http-request="onUpload"
            :show-file-list="false"
            :limit="1"
          >
            <el-button :icon="useRenderIcon(Upload)" type="primary"
              >导入数据</el-button
            >
          </el-upload>
        </div>
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
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="handlerDistributeProperty(row)"
                    >
                      资产分配
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <PlusDialogForm
      ref="addFormRef"
      v-model:visible="dialogFormVisible"
      v-model="addForm"
      :dialog="{ title: title }"
      :form="{
        columns: columnsForm,
        rules,
        labelWidth: '95px',
        rowProps: {
          gutter: 20
        },
        colProps: {
          span: 12
        }
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
