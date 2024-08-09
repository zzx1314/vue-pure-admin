<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useDevice } from "@/views/ota/deviceone/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";

defineOptions({
  name: "Device"
});

const formRef = ref();
const addFormRef = ref<FormInstance>();

const {
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  dialogFormVisible,
  title,
  addForm,
  status,
  rules,
  moreCondition,
  cancel,
  restartForm,
  submitForm,
  openDia,
  onSearch,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useDevice();
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="设备ID" prop="name">
        <el-input
          v-model="queryForm.devId"
          placeholder="请输入设备ID"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="设备IP" prop="name">
        <el-input
          v-model="queryForm.devIp"
          placeholder="请输入设备IP"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="name">
        <el-input
          v-model="queryForm.devIp"
          placeholder="请输入设备类型"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="设备组别：" prop="devType">
            <el-input
              v-model="queryForm.devGroup"
              placeholder="请输入设备组别"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>

          <el-form-item label="设备状态：" prop="status">
            <el-select
              v-model="queryForm.status"
              placeholder="请选择设备状态"
              class="!w-[200px]"
            >
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-collapse-transition>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="restartForm(formRef)">
          重置
        </el-button>
        <el-button
          type="text"
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
          @click="moreCondition = !moreCondition"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="设备列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增设备', addFormRef)"
        >
          添加
        </el-button>
      </template>
      <template v-slot="{ size, checkList, dynamicColumns }">
        <pure-table
          border
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="设备ID" prop="devId">
          <el-input v-model="addForm.value.devId" placeholder="请输入设备ID" />
        </el-form-item>

        <el-form-item label="设备IP" prop="devIp">
          <el-input v-model="addForm.value.devIp" placeholder="请输入设备IP" />
        </el-form-item>

        <el-form-item label="设备类型" prop="type">
          <el-input v-model="addForm.value.type" placeholder="请输入设备类型" />
        </el-form-item>

        <el-form-item label="设备版本" prop="versionInfo">
          <el-input
            v-model="addForm.value.versionInfo"
            placeholder="请输入设备版本"
          />
        </el-form-item>
        <el-form-item label="设备组别" prop="group">
          <el-input
            v-model="addForm.value.devGroup"
            placeholder="请输入设备组别"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.value.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitForm(addFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
