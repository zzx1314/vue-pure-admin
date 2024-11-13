<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import EditPen from "@iconify-icons/ep/edit-pen";
import { useDictBus } from "@/views/system/sysDict/hook";
import { useDictForm } from "@/views/system/sysDict/form";

defineOptions({
  name: "sysDict"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm } = useDictForm();

const {
  queryForm,
  dataList,
  loading,
  dialogFormVisible,
  dialogItemFormVisible,
  pagination,
  addForm,
  rules,
  columns,
  columnsItem,
  dataListMode,
  editMap,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleUpdate,
  handleSubmit,
  handleSubmitError,
  openDia,
  openSetDia,
  cancel,
  onAdd,
  onEdit,
  onSave,
  onCancel,
  onDel
} = useDictBus();
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
    <PureTableBar title="字典列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加字典', addFormRef)"
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
              @click="openSetDia(row)"
            >
              字典项
            </el-button>
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <PlusDialogForm
      ref="addFormRef"
      v-model:visible="dialogFormVisible"
      v-model="addForm"
      :dialog="{ title: '修改字典' }"
      :form="{
        columns: columnsForm,
        rules,
        labelWidth: '100px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />
    <el-dialog v-model="dialogItemFormVisible" title="设置字典项" width="60%">
      <pure-table
        row-key="id"
        align-whole="center"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
        :border="true"
        :data="dataListMode"
        :columns="columnsItem"
      >
        <template #append>
          <el-button
            plain
            class="w-full my-2"
            :icon="useRenderIcon(AddFill)"
            @click="onAdd"
          >
            添加一行数据
          </el-button>
        </template>
        <template #operation="{ row, index }">
          <el-button
            v-if="!editMap[index]?.editable"
            class="reset-margin"
            link
            type="primary"
            @click="onEdit(row, index)"
          >
            修改
          </el-button>
          <el-button
            v-if="!editMap[index]?.editable"
            class="reset-margin"
            link
            type="primary"
            @click="onDel(row)"
          >
            删除
          </el-button>
          <div v-if="editMap[index]?.editable">
            <el-button
              class="reset-margin"
              link
              type="primary"
              @click="onSave(index)"
            >
              保存
            </el-button>
            <el-button class="reset-margin" link @click="onCancel(index)">
              取消
            </el-button>
          </div>
        </template>
      </pure-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding-bottom: 0;
}

:deep(.el-link) {
  padding-left: 10px;
}
</style>
