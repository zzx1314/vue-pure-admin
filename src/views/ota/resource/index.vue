<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useResource } from "@/views/ota/resource/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Position from "@iconify-icons/ep/position";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";

defineOptions({
  name: "Resource"
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
  rules,
  addType,
  updateType,
  moreCondition,
  devOption,
  cancel,
  submitForm,
  openDia,
  onSearch,
  resetForm,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useResource();
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="操作系统：" prop="softwareName">
        <el-input
          v-model="queryForm.softwareName"
          placeholder="请输入操作系统名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="操作系统版本：" prop="softwareVersion">
        <el-input
          v-model="queryForm.softwareVersion"
          placeholder="请输入系统版本名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="设备类型：" prop="devType">
        <el-select
          v-model="queryForm.devType"
          placeholder="选择设备类型"
          style="width: 200px"
        >
          <el-option
            v-for="item in devOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="组件包名称：" prop="pkgName">
            <el-input
              v-model="queryForm.pkgName"
              placeholder="请输入组件包名称"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="组件包版本：" prop="version">
            <el-input
              v-model="queryForm.version"
              placeholder="请输入组件包版本"
              clearable
              class="!w-[200px]"
            />
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
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>

        <el-button
          type="text"
          @click="moreCondition = !moreCondition"
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="资源列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加操作系统')"
        >
          添加操作系统
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加模块')"
        >
          添加模块
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Position)"
          @click="openDia('推送资源')"
        >
          推送
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="columns"
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
              @click="handleUpdate(row)"
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

    <el-dialog v-model="dialogFormVisible" :title="title" width="60%">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item
          label="操作系统名称"
          prop="softwareName"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.softwareName"
            placeholder="请输入软件名称"
          />
        </el-form-item>

        <el-form-item
          label="操作系统版本"
          prop="softwareVersion"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.softwareVersion"
            placeholder="请输入操作系统版本"
          />
        </el-form-item>

        <el-form-item
          label="设备类型"
          prop="devType"
          v-if="addType === 'addSoftware' || updateType === 'updateSoftware'"
        >
          <el-select
            v-model="addForm.value.devType"
            placeholder="选择设备类型"
            style="width: 200px"
          >
            <el-option
              v-for="item in devOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="模块包名称"
          prop="pkgName"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.pkgName"
            placeholder="请输入模块包名称"
          />
        </el-form-item>

        <el-form-item
          label="模块版本"
          prop="version"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-input
            v-model="addForm.value.version"
            placeholder="请输入模块包类型"
          />
        </el-form-item>

        <el-form-item
          label="操作系统"
          prop="parentId"
          v-if="addType !== 'addSoftware' && updateType !== 'updateSoftware'"
        >
          <el-select
            v-model="addForm.value.parentId"
            placeholder="请选择所属操作系统"
            style="width: 200px"
          >
            <el-option
              v-for="item in devOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel(addFormRef)">取消</el-button>
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
