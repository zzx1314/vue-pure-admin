<script setup lang="ts">
import { ref } from "vue";
import { type ElDialog, FormInstance } from "element-plus";
import { useOBusDevice } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import More from "@iconify-icons/ep/more-filled";
import Password from "@iconify-icons/ri/lock-password-line";
import "@xterm/xterm/css/xterm.css";

defineOptions({
  name: "OBusDevice"
});

const addFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm, columnsFormShellLogin } =
  useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  title,
  pagination,
  addForm,
  loginShellForm,
  rules,
  columns,
  dialogFormVisible,
  dialogShellVisible,
  dialogShellLoginVisible,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSubmitError,
  handleSubmit,
  handleShellSubmit,
  handleShallLogin,
  handleDialogOpened,
  handleDialogClosed,
  cancel,
  openDia
} = useOBusDevice();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="4"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      />
    </el-card>
    <PureTableBar title="设备列表" :columns="columns" @refresh="onSearch">
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
            <div class="flex justify-between">
              <div class="flex-1 px-4 flex flex-col items-center">
                <h3 class="mb-1">硬件信息</h3>
                <div
                  v-for="hia in row.hardwareInfoJArray"
                  :key="hia.name"
                  class="mb-1"
                >
                  <div>{{ hia.name }}: {{ hia.value }}</div>
                </div>
              </div>
              <div class="flex-1 px-4 flex flex-col items-center">
                <h3 class="mb-1">软件信息</h3>
                <div
                  v-for="sia in row.softwareInfoJArray"
                  :key="sia.name"
                  class="mb-1"
                >
                  <div>{{ sia.name }}: {{ sia.version }}</div>
                </div>
              </div>
              <div class="flex-1 px-4 flex flex-col items-center">
                <h3 class="mb-1">系统状态</h3>
                <div
                  v-for="ssa in row.systemStatusJArray"
                  :key="ssa.name"
                  class="mb-1"
                >
                  <div>{{ ssa.name }}: {{ ssa.value }}</div>
                </div>
              </div>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDia(row, addFormRef)"
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
                      :icon="useRenderIcon(Password)"
                      @click="handleShallLogin(row)"
                    >
                      远程登录
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
        labelWidth: '150px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />

    <PlusDialogForm
      ref="loginShellFormRef"
      v-model:visible="dialogShellLoginVisible"
      v-model="loginShellForm"
      :dialog="{ title: '远程登录', width: '' }"
      :form="{
        columns: columnsFormShellLogin,
        rules,
        labelWidth: '80px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleShellSubmit"
    />

    <el-dialog
      v-model="dialogShellVisible"
      class="shellDialog"
      fullscreen
      @open="handleDialogOpened"
      @close="handleDialogClosed"
    >
      <div id="terminal" class="indexContainer" />
    </el-dialog>
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
