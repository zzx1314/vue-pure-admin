<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useActThTask } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import search from "@iconify-icons/ep/search";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import {PlusDialogForm, PlusForm, PlusSearch} from "plus-pro-components";
import BpmnProcess from "@/views/system/sysBpmn/bpmnProcess.vue";

defineOptions({
  name: "ActThTask"
});

const addFormRef = ref<FormInstance>();
const { licenseProject, columnsQueryForm, columnsApproyForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  dialogViewBpmn,
  dialogViewBpmnApprove,
  pagination,
  columns,
  bpmnXmlStr,
  historyNodeIds,
  currentNodeIds,
  historyApproyColumns,
  historyApproyData,
  approyData,
  submitApproy,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSelectBpmn,
  handleApprover,
  cancel
} = useActThTask();
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
    <PureTableBar title="业务列表" :columns="columns" @refresh="onSearch">
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
              流程审批
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

    <el-dialog v-model="dialogViewBpmnApprove" title="流程审批" @close="cancel" width="70%">
      <div class="common-layout">
        <el-container>
          <el-aside width="350px">
            <el-card>
              <PlusForm :columns="licenseProject" :hasFooter="false"/>
            </el-card>
          </el-aside>
          <el-main>
            <div class="mb-2">
              <el-card>
                <pure-table align-whole="center" showOverflowTooltip :data="historyApproyData" :columns="historyApproyColumns" border />
              </el-card>
            </div>
            <el-card>
              <PlusForm v-model="approyData" :columns="columnsApproyForm"  @submit="submitApproy">
              </PlusForm>
            </el-card>
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
