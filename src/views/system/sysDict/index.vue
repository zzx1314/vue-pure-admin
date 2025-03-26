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
import { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import { message } from "@/utils/message";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import ArrowUp from "@iconify-icons/ep/arrow-up-bold";
import ArrowDown from "@iconify-icons/ri/arrow-down-s-line";
import { hasAuth } from "@/router/utils";

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
  allowDeletion: boolean;
}

const tableRef = ref<VxeTableInstance<RowVO>>();
const disabledFiled = ref(false);
const disabledValue = ref(false);
const disabledRemark = ref(false);
const disabledDescription = ref(false);

const validRules = ref<VxeTablePropTypes.EditRules<RowVO>>({
  type: [{ required: true, content: "类型必须填写" }],
  label: [{ required: true, content: "标签必须填写" }]
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
      const result = await onSave(row);
      if (result) {
        $table.clearEdit();
      }
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
  const $table = tableRef.value;
  if ($table) {
    $table.remove(row);
    onDel(row);
  }
};

const editActivatedEvent: VxeTableEvents.EditActivated<RowVO> = ({ row }) => {
  disabledFiled.value = !row.allowDeletion;
  disabledValue.value =
    row.label === "日志" ||
    row.label === "自定义指令" ||
    row.label === "自定义";
  disabledRemark.value =
    row.label === "心跳时间" ||
    row.label === "定时删除历史心跳" ||
    row.label === "定时删除系统日志";
  disabledDescription.value = row.label === "心跳时间";
};

const addEvent = async () => {
  const $table = tableRef.value;
  if ($table) {
    const record = {
      type: "",
      label: "",
      value: "",
      description: "",
      remarks: "",
      allowDeletion: true
    };
    const { row: newRow } = await $table.insert(record);
    $table.setEditRow(newRow, "type");
  }
};

const deviceType = ref([
  {
    label: "一周",
    value: "7"
  },
  {
    label: "一个月",
    value: "30"
  },
  {
    label: "两个月",
    value: "60"
  },
  {
    label: "半年",
    value: "180"
  },
  {
    label: "一年",
    value: "365"
  }
]);

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
  titleValue,
  isShowItemAdd,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleUpdate,
  handleSubmit,
  handleSubmitError,
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
    <PureTableBar title="配置列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <!--        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增配置', addFormRef)"
        >
          新增
        </el-button>-->
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
              v-if="row.allowDeletion && hasAuth('dict_update')"
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
              v-if="row.allowDeletion && hasAuth('dict_del')"
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
      :dialog="{ title: titleValue }"
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
      <div class="mb-1">
        <el-button
          v-if="isShowItemAdd && hasAuth('dict_add')"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="addEvent"
          >新增</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        border
        show-overflow
        keep-source
        height="500"
        :row-config="{ isHover: true }"
        :data="dataListMode"
        :edit-rules="validRules"
        :edit-config="{
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
          autoClear: false,
          showIcon: false
        }"
        @edit-activated="editActivatedEvent"
      >
        <vxe-column type="seq" width="70" />
        <vxe-column field="type" title="配置类型" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.type" :disabled="disabledFiled" />
          </template>
        </vxe-column>
        <vxe-column field="label" title="标签" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.label" :disabled="disabledFiled" />
          </template>
        </vxe-column>
        <vxe-column
          field="value"
          title="数据值"
          show-overflow
          :edit-render="{ name: 'VxeInput' }"
        >
          <template #edit="{ row }">
            <vxe-number-input
              v-if="
                row.label === '心跳时间' ||
                row.label === 'CPU阈值' ||
                row.label === '磁盘阈值' ||
                row.label === '内存阈值'
              "
              v-model="row.value"
              :min="10"
              :max="row.label === '心跳时间' ? 300 : 100"
            />
            <vxe-select
              v-else-if="
                row.label === '定时删除历史心跳' ||
                row.label === '定时删除系统日志'
              "
              v-model="row.value"
              :options="deviceType"
            />
            <vxe-input v-else v-model="row.value" :disabled="disabledValue" />
          </template>
        </vxe-column>
        <vxe-column field="description" title="配置描述" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input
              v-model="row.description"
              :disabled="disabledDescription"
            />
          </template>
        </vxe-column>
        <vxe-column field="remarks" title="备注" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.remarks" :disabled="disabledRemark" />
          </template>
        </vxe-column>
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
:deep(.el-link) {
  padding-left: 10px;
}
</style>
