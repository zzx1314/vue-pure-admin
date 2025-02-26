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
import alignItemBottomLine from "@iconify-icons/ri/archive-drawer-line";
import { useDictBus } from "@/views/system/sysDict/hook";
import { useDictForm } from "@/views/system/sysDict/form";
import { VxeTableInstance, VxeTablePropTypes, VxeUI } from "vxe-table";
import { message } from "@/utils/message";

defineOptions({
  name: "sysDict"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm } = useDictForm();

interface RowVO {
  id: number;
  type: string;
  label: string;
  value: string;
  description: string;
  remarks: string;
}

const tableRef = ref<VxeTableInstance<RowVO>>();

const validRules = ref<VxeTablePropTypes.EditRules<RowVO>>({
  type: [{ required: true, message: "类型必须填写" }],
  label: [{ required: true, message: "标签必须填写" }]
});

const hasEditStatus = (row: RowVO) => {
  const $table = tableRef.value;
  if ($table) {
    return $table.isEditByRow(row);
  }
};

const saveRowEvent = async (row: RowVO) => {
  const $table = tableRef.value;
  if ($table) {
    const errMap = await $table.validate(true);
    if (errMap) {
      message("校验不通过", { type: "error" });
    } else {
      $table.clearEdit().then(() => {
        onSave(row);
      });
    }
  }
};

const cancelRowEvent = (row: RowVO) => {
  const $table = tableRef.value;
  if ($table) {
    $table.clearEdit().then(() => {
      // 还原行数据
      $table.revertData(row);
    });
  }
};

const editRowEvent = (row: RowVO) => {
  const $table = tableRef.value;
  if ($table) {
    $table.setEditRow(row);
  }
};

const removeRow = async (row: RowVO) => {
  dataListMode.value = dataListMode.value.filter(item => item.id !== row.id);
  onDel(row);
};

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
  dataListMode,
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
  onSave,
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
    <PureTableBar title="配置列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加配置', addFormRef)"
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
              :icon="useRenderIcon(alignItemBottomLine)"
              @click="openSetDia(row)"
            >
              配置项
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
            <el-popconfirm
              v-if="row.allowDeletion"
              title="是否确认删除?"
              @confirm="handleDelete(row)"
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

    <PlusDialogForm
      ref="addFormRef"
      v-model:visible="dialogFormVisible"
      v-model="addForm"
      :dialog="{ title: '修改配置' }"
      :form="{
        columns: columnsForm,
        rules,
        labelWidth: '100px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />
    <el-dialog
      v-model="dialogItemFormVisible"
      title="设置配置项"
      width="65%"
      @close="cancel"
    >
      <vxe-table
        ref="tableRef"
        border
        show-overflow
        keep-source
        height="500"
        :row-config="{ isHover: true }"
        :tooltip-config="{ zIndex: 10000 }"
        :data="dataListMode"
        :edit-rules="validRules"
        :edit-config="{
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
          autoClear: false
        }"
      >
        <vxe-column type="seq" width="70" />
        <vxe-column
          field="type"
          title="配置类型"
          :edit-render="{ name: 'VxeInput' }"
        />
        <vxe-column
          field="label"
          title="标签"
          :edit-render="{ name: 'VxeInput' }"
        />
        <vxe-column
          field="value"
          title="数据值"
          show-overflow
          :edit-render="{ name: 'VxeInput' }"
        />
        <vxe-column
          field="description"
          title="配置描述"
          :edit-render="{ name: 'VxeInput' }"
        />
        <vxe-column
          field="remarks"
          title="备注"
          :edit-render="{ name: 'VxeInput' }"
        />
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <template v-if="hasEditStatus(row)">
              <el-button type="primary" plain @click="saveRowEvent(row)"
                >保存</el-button
              >
              <el-button @click="cancelRowEvent(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button
                type="primary"
                plain
                :icon="useRenderIcon(EditPen)"
                @click="editRowEvent(row)"
                >编辑</el-button
              >
              <el-button
                v-if="row.allowDeletion"
                type="danger"
                plain
                :icon="useRenderIcon(Delete)"
                @click="removeRow(row)"
                >删除</el-button
              >
            </template>
          </template>
        </vxe-column>
      </vxe-table>
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
