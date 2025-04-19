<script setup lang="ts">
import { useActThTaskHis } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusForm, PlusSearch } from "plus-pro-components";
import search from "@iconify-icons/ep/search";
import BpmnProcess from "@/views/system/sysBpmn/bpmnProcess.vue";

defineOptions({
  name: "ActThTaskHis"
});

const { columnsQueryForm, licenseProject } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  pagination,
  columns,
  bpmnXmlStr,
  historyNodeIds,
  currentNodeIds,
  dialogViewBpmn,
  dialogViewBpmnApprove,
  licenseProjectData,
  historyApproyData,
  historyApproyColumns,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  cancel,
  handleApprover,
  handleSelectBpmn
} = useActThTaskHis();
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
    <PureTableBar title="历史流程列表" :columns="columns" @refresh="onSearch">
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
              @click="handleApprover(row)"
            >
              审批过程
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(search)"
              @click="handleSelectBpmn(row)"
            >
              查看流程图
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog v-model="dialogViewBpmn" title="流程图" @close="cancel">
      <bpmn-process
        :bpmn-xml-str="bpmnXmlStr"
        :current-node-ids="currentNodeIds"
        :history-node-ids="historyNodeIds"
      />
    </el-dialog>

    <el-dialog
      v-model="dialogViewBpmnApprove"
      title="流程审批"
      width="75%"
      @close="cancel"
    >
      <div class="common-layout">
        <el-container>
          <el-aside width="350px">
            <el-card>
              <PlusForm
                v-model="licenseProjectData"
                :columns="licenseProject"
                :hasFooter="false"
              />
            </el-card>
          </el-aside>
          <el-main>
            <div class="mb-2">
              <el-card>
                <pure-table
                  align-whole="center"
                  showOverflowTooltip
                  :data="historyApproyData"
                  :columns="historyApproyColumns"
                  border
                />
              </el-card>
            </div>
          </el-main>
        </el-container>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
