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
import { PlusDialogForm, PlusSearch } from "plus-pro-components";

defineOptions({
  name: "ActThTask"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  dialogFormVisible,
  title,
  pagination,
  addForm,
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
  cancel,
  openDia
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
              @click="handleUpdate(row, addFormRef)"
            >
              流程审批
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(search)"
              @click="handleUpdate(row, addFormRef)"
            >
              查看流程图
            </el-button>
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
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
