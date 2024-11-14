<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useCollectorBusDev } from "@/views/collector/device/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "@/views/collector/device/form";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import AddFill from "@iconify-icons/ri/add-circle-line";
import PureTable from "@pureadmin/table";
import EditPen from "@iconify-icons/ep/edit-pen";
import Setting from "@iconify-icons/ep/setting";

defineOptions({
  name: "CollectorBusDev"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  dialogFormVisible,
  dialogModeFormVisible,
  pagination,
  addForm,
  rules,
  columns,
  columnsSensor,
  dataListMode,
  editMap,
  columnsSensorConf,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleUpdate,
  handleSubmit,
  handleSubmitError,
  cancel,
  openSetDia,
  onAdd,
  onEdit,
  onSave,
  onCancel,
  onDel
} = useCollectorBusDev();
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
    <PureTableBar title="采集器列表" :columns="columns" @refresh="onSearch">
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
          <template #expand="{ row }">
            <div class="px-11">
              <h3>传感器</h3>
              <pure-table
                :data="row.sensorsInfo"
                :columns="columnsSensor"
                :border="true"
              >
                <template #content="{ row }">
                  <span v-html="row.configInfoHtml" />
                </template>
                <template #operation="{ row }">
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Setting)"
                    @click="openSetDia(row)"
                  >
                    配置
                  </el-button>
                </template>
              </pure-table>
            </div>
          </template>
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <PlusDialogForm
      ref="addFormRef"
      v-model:visible="dialogFormVisible"
      v-model="addForm"
      :dialog="{ title: '修改采集器' }"
      :form="{
        columns: columnsForm,
        rules,
        labelWidth: '100px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />

    <el-dialog v-model="dialogModeFormVisible" title="设置配置">
      <pure-table
        row-key="id"
        align-whole="center"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
        :border="true"
        :data="dataListMode"
        :columns="columnsSensorConf"
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

:deep(.el-table__expand-icon > .el-icon) {
  font-size: 20px;
  font-weight: bold;
  color: #549e2f;
}
</style>
