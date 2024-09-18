<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useTask } from "@/views/ota/task/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import Download from "@iconify-icons/ep/download";
import { hasAuth } from "@/router/utils";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";

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
  moreCondition,
  restartForm,
  onSearch,
  handleDesc,
  handleDelete,
  handleSizeChange,
  handleDevSizeChange,
  handleCurrentChange,
  handleDevCurrentChange,
  handleSelectionChange,
  handleDevSelectionChange,
  handleDown
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
        <el-input
          v-model="queryForm.taskType"
          placeholder="请输入任务类型"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryForm.status"
          placeholder="请选择状态"
          class="!w-[180px]"
        >
          <el-option label="已下发" value="已下发" />
          <el-option label="已完成" value="已完成" />
          <el-option label="未完成" value="未完成" />
        </el-select>
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="开始时间：" prop="beginTime">
            <el-date-picker
              v-model="queryForm.beginTime"
              type="date"
              placeholder="请输入开始时间"
              class="!w-[180px]"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="结束时间：" prop="endTime">
            <el-date-picker
              v-model="queryForm.endTime"
              placeholder="请输入结束时间"
              type="date"
              class="!w-[180px]"
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
        <el-button :icon="useRenderIcon(Refresh)" @click="restartForm(formRef)">
          重置
        </el-button>
        <el-button
          type="text"
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
          @click="moreCondition = !moreCondition"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="任务列表" :columns="columns" @refresh="onSearch">
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
              v-if="hasAuth('task_del')"
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
                  v-if="hasAuth('task_desc')"
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
              adaptive
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
            >
              <template #operation="{ row }">
                <el-button
                  v-if="row.status === '生效失败'"
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Download)"
                  @click="handleDown(row)"
                >
                  下载日志
                </el-button>
              </template>
            </pure-table>
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
