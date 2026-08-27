<script setup lang="ts">
import { useOBusCommand } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusSearch } from "plus-pro-components";
import Refresh from "@iconify-icons/ep/refresh";
import CompanyAssignDialog from "@/views/obusdevice/components/CompanyAssignDialog.vue";
import ArrowUp from "@iconify-icons/ep/arrow-up-bold";
import ArrowDown from "@iconify-icons/ri/arrow-down-s-line";

defineOptions({
  name: "OBusCommand"
});

const { columnsQueryForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  pagination,
  columns,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  cancel,
  companyDialogVisible,
  assigningRow,
  selectedCompanyId,
  companyTree,
  openAssignDialog,
  handleConfirmCompany
} = useOBusCommand();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="3"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      >
        <template
          #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
        >
          <div style="display: flex">
            <el-button
              type="primary"
              :icon="useRenderIcon(Search)"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button :icon="useRenderIcon(Refresh)" @click="handleReset"
              >重置</el-button
            >
            <el-button
              type="primary"
              :icon="
                isShowUnfold ? useRenderIcon(ArrowUp) : useRenderIcon(ArrowDown)
              "
              link
              @click="handleUnfold"
            >
              {{ isShowUnfold ? "收起" : "展开" }}
            </el-button>
          </div>
        </template>
      </PlusSearch>
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
              :type="row.companyId ? 'warning' : 'primary'"
              :size="size"
              @click="openAssignDialog(row)"
            >
              {{ row.companyId ? "转移单位" : "分配单位" }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <CompanyAssignDialog
      v-model="companyDialogVisible"
      v-model:selected-company-id="selectedCompanyId"
      :assigning-row="assigningRow"
      :company-tree="companyTree"
      @confirm="handleConfirmCompany"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-link) {
  padding-left: 10px;
}
</style>
