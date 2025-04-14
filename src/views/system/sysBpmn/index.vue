<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useActThProcessConf } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Refresh from "@iconify-icons/ep/Refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import AddFill from "@iconify-icons/ri/add-circle-line";
import More from "@iconify-icons/ep/more-filled";
import BpmProcessDesign from "@/views/system/sysBpmn/bpmProcessDesign.vue";

defineOptions({
  name: "ActThProcessConf"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  dataListHistory,
  loading,
  dialogFormVisible,
  dialogDesignVisible,
  dialogViewHistory,
  title,
  pagination,
  paginationHistory,
  addForm,
  rules,
  columns,
  historyColumns,
  currentRow,
  currentBpnmId,
  isShowDeploy,
  onSearch,
  onSearchHistory,
  handleUpdate,
  handleDelete,
  handleDeleteHistory,
  handleSizeChange,
  handleSizeChangeHistory,
  handleCurrentChange,
  handleCurrentChangeHistory,
  handleSelectionChange,
  handleSelectionChangeHistory,
  handleSubmitError,
  handleSubmit,
  cancel,
  openDia,
  setBpmn,
  setBpmnHistory,
  closeDesign,
  refeshBpmn
} = useActThProcessConf();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="2"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      />
    </el-card>
    <PureTableBar title="流程列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增', addFormRef)"
        >
          新增
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
                      @click="setBpmn(row)"
                    >
                      流程设计
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Refresh)"
                      @click="refeshBpmn(row)"
                    >
                      流程更新
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
        labelWidth: '100px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />
    <bpm-process-design
      :dialog-design-visible="dialogDesignVisible"
      :config-info="currentRow"
      :process-id="currentBpnmId"
      :isShowDeploy="isShowDeploy"
      @update:dialogDesignVisible="closeDesign"
    />
    <el-dialog
      v-model="dialogViewHistory"
      append-to-body
      title="历史流程图"
      width="75%"
      @close="cancel"
    >
      <PureTableBar
        title="历史流程列表"
        :columns="historyColumns"
        @refresh="onSearchHistory"
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
            :data="dataListHistory"
            :columns="dynamicColumns"
            :checkList="checkList"
            :pagination="paginationHistory"
            :paginationSmall="size === 'small'"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChangeHistory"
            @page-size-change="handleSizeChangeHistory"
            @page-current-change="handleCurrentChangeHistory"
          >
            <template #operation="{ row }">
              <el-button
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="setBpmnHistory(row)"
              >
                流程设计
              </el-button>
              <el-popconfirm
                title="是否确认删除?"
                @confirm="handleDeleteHistory(row)"
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
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
