<script setup lang="ts">
import { ref } from "vue";
import { useDept } from "./hook";

import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";

defineOptions({
  name: "sysOrg"
});
const formRef = ref();
const tableRef = ref();
const addFormRef = ref();
const {
  addForm,
  searchForm,
  dialogFormVisible,
  options,
  loading,
  columns,
  dataList,
  rules,
  title,
  moreCondition,
  onSearch,
  resetForm,
  cancel,
  submitForm,
  openDia,
  changeSelet,
  handleUpdate,
  handleSelectionChange,
  confirmEvent,
  cancelEvent
} = useDept();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="部门名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入部门名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="部门类型：" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入类型"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="排序：" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入部门排序"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="开始时间：" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入开始时间"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
          <el-form-item label="结束时间：" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入结束时间"
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
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
          @click="moreCondition = !moreCondition"
        />
      </el-form-item>
    </el-form>

    <PureTableBar
      title="组织列表"
      :tableRef="tableRef?.getTableRef()"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加组织')"
        >
          新增部门
        </el-button>
      </template>
      <template v-slot="{ size, checkList, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :checkList="checkList"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
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
            <el-popconfirm
              title="是否确认删除?"
              @confirm="confirmEvent(row)"
              @cancel="cancelEvent"
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

    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.value.name" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select
            v-model="addForm.value.type"
            placeholder="请选择类型"
            @change="changeSelet()"
          >
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="addForm.value.type !== 'top'"
          label="上级"
          prop="parentId"
        >
          <el-tree-select
            v-model="addForm.value.parentId"
            :data="dataList"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addForm.value.sort" :min="1" :max="10" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="addForm.value.remarks"
            type="textarea"
            placeholder="请输入"
          />
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
.mc-btn {
  width: 100%;
  height: 17px;
  padding: 0;
  color: #c0c4cc;
}

.mc-btn:hover {
  background-color: #f2f6fc;
}
</style>
