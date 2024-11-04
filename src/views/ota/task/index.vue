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
  dialogStatusVisible,
  title,
  devClumns,
  resDataList,
  moreCondition,
  activStatus,
  step1,
  step2,
  step3,
  step4,
  step5,
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
  handleDown,
  handleShowStatus
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
                  v-if="row.status === '失败'"
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
              <template #status="{ row }">
                <el-button
                  v-if="row.status === '成功'"
                  type="success"
                  text
                  @click="handleShowStatus(row)"
                  >{{ row.status }}
                </el-button>
                <el-button
                  v-else-if="row.status === '失败'"
                  type="danger"
                  text
                  @click="handleShowStatus(row)"
                >
                  {{ row.status }}</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  text
                  @click="handleShowStatus(row)"
                >
                  {{ row.status }}
                </el-button>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogStatusVisible" title="任务状态" width="50%">
      <div class="statusMain">
        <div class="a1">
          <h4
            :style="{
              color: activStatus === '安装包制作' ? '#E6A23C' : '#258a15'
            }"
          >
            {{ step1 }}
          </h4>
          <div class="a3" />
          <div class="a4" />
        </div>
        <div class="a1">
          <h4
            :style="{
              color:
                activStatus === '待下发'
                  ? '#E6A23C'
                  : activStatus === '安装包制作'
                    ? '#909399'
                    : '#258a15'
            }"
          >
            {{ step2 }}
          </h4>
          <div class="a3" />
          <div class="a4" />
        </div>
        <div class="a1">
          <h4
            :style="{
              color:
                activStatus === '接受任务'
                  ? '#E6A23C'
                  : activStatus === '安装包制作' || activStatus === '待下发'
                    ? '#909399'
                    : '#258a15'
            }"
          >
            {{ step3 }}
          </h4>
          <div class="a3" />
          <div class="a4" />
        </div>
        <div class="a1">
          <h4
            :style="{
              color:
                activStatus === '下载成功'
                  ? '#258a15'
                  : activStatus === '下载失败'
                    ? '#F56C6C'
                    : activStatus === '安装包制作' ||
                        activStatus === '待下发' ||
                        activStatus === '接受任务'
                      ? '#909399'
                      : '#258a15'
            }"
          >
            {{ step4 }}
          </h4>
          <div class="a3" />
          <div class="a4" />
        </div>
        <div class="a1">
          <h4
            :style="{
              color:
                activStatus === '升级成功'
                  ? '#258a15'
                  : activStatus === '升级失败'
                    ? '#F56C6C'
                    : activStatus === '安装包制作' ||
                        activStatus === '待下发' ||
                        activStatus === '接受任务' ||
                        activStatus === '下载成功'
                      ? '#909399'
                      : '#258a15'
            }"
          >
            {{ step5 }}
          </h4>
          <div class="a3" />
          <div class="a4" />
        </div>
        <div />
        <div />
        <div />
        <div />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.statusMain {
  display: flex;
  gap: 3px;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 子元素之间均匀分布 */
  width: 100%;
  height: 100px;
}

/* 长方形 */
.a1 {
  position: relative;
  display: flex;
  width: 85px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background-color: rgb(91 155 236 / 60%);
}

/* 右边上三角 */
.a3 {
  position: absolute;
  top: 0;
  right: -20px;
  width: 0;
  height: 0;
  margin-left: 10px;
  border-top: 18px solid rgb(91 155 236 / 60%);
  border-right: 20px solid transparent;
}

/* 右边下三角 */
.a4 {
  position: absolute;
  top: 20px;
  right: -20px;
  width: 0;
  height: 0;
  border-right: 20px solid transparent;
  border-bottom: 16px solid rgb(91 155 236 / 60%);
}
</style>
