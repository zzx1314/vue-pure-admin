<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useTask } from "@/views/ota/task/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "Task"
});

const formRef = ref();
const addFormRef = ref<FormInstance>();

const {
  queryForm,
  loading,
  columns,
  dataList,
  devDataList,
  pagination,
  dialogFormVisible,
  title,
  devClumns,
  resDataList,
  restartForm,
  onSearch,
  handleDesc,
  handleDelete,
  handleSizeChange,
  handleDevSizeChange,
  handleCurrentChange,
  handleDevCurrentChange,
  handleSelectionChange,
  handleDevSelectionChange
} = useTask();
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model="queryForm.taskName"
          placeholder="请输入任务名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select
          v-model="queryForm.taskType"
          placeholder="请选择任务类型"
          class="!w-[180px]"
        >
          <el-option label="全量升级" value="全量升级" />
          <el-option label="部分升级" value="部分升级" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryForm.status"
          placeholder="请选择状态"
          class="!w-[180px]"
        >
          <el-option label="开始" value="开始" />
          <el-option label="下发" value="下发" />
          <el-option label="完成" value="完成" />
        </el-select>
      </el-form-item>
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
      </el-form-item>
    </el-form>

    <PureTableBar title="任务列表" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, checkList, dynamicColumns }">
        <pure-table
          border
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
              :icon="useRenderIcon(Search)"
              @click="handleDesc(row, addFormRef)"
            >
              详情
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

    <el-dialog v-model="dialogFormVisible" :title="title" width="70%">
      <div>
        <div class="flex gap-2">
          <p style="font-weight: bold">资源信息:</p>
          <el-tag
            v-for="(item, index) in resDataList"
            :key="index"
            type="success"
          >
            {{ item }}</el-tag
          >
        </div>
        <PureTableBar
          title="下发设备列表"
          :columns="devClumns"
          @refresh="onSearch"
        >
          <template v-slot="{ size, checkList, dynamicColumns }">
            <pure-table
              border
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="loading"
              :size="size"
              :data="devDataList"
              :columns="dynamicColumns"
              :checkList="checkList"
              :paginationSmall="size === 'small'"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
              @selection-change="handleDevSelectionChange"
              @page-size-change="handleDevSizeChange"
              @page-current-change="handleDevCurrentChange"
            />
          </template>
        </PureTableBar>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
