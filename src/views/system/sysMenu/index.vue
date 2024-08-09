<script setup lang="ts">
import { ref } from "vue";
import { useMenu } from "./hook";

import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "sysMenu"
});
const tableRef = ref();
const addFormRef = ref();
const {
  addForm,
  dialogFormVisible,
  options,
  loading,
  columns,
  dataList,
  rules,
  title,
  onSearch,
  cancel,
  submitForm,
  openDia,
  handleUpdate,
  handleSelectionChange,
  confirmEvent,
  cancelEvent
} = useMenu();
</script>

<template>
  <div class="main">
    <PureTableBar
      title="菜单列表"
      :tableRef="tableRef?.getTableRef()"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('添加菜单')"
        >
          新增菜单
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
              @click="handleUpdate(row)"
              :icon="useRenderIcon(EditPen)"
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
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.value.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select
            v-model="addForm.value.type"
            placeholder="请选择类型"
            style="width: 200px"
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
          label="路由"
          prop="component"
          v-if="addForm.value.type == 3"
        >
          <el-input
            placeholder="请输入路由"
            v-model="addForm.value.component"
          />
        </el-form-item>

        <el-form-item
          label="路径"
          prop="pathUrl"
          v-if="addForm.value.type == 3"
        >
          <el-input placeholder="请输入路径" v-model="addForm.value.pathUrl" />
        </el-form-item>

        <el-form-item
          label="上级菜单"
          prop="parentId"
          v-if="addForm.value.type !== 1"
        >
          <el-tree-select
            v-model="addForm.value.parentId"
            :data="dataList"
            filterable
            check-strictly
            :render-after-expand="false"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item
          label="权限标识"
          prop="permission"
          v-if="addForm.value.type == 4"
        >
          <el-input
            placeholder="请输入权限标识"
            v-model="addForm.value.permission"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="addForm.value.sort"
            :min="1"
            :max="10"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item
          label="子节点"
          prop="leaf"
          v-if="addForm.value.type !== 4"
        >
          <el-radio-group v-model="addForm.value.leaf" style="width: 200px">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">不是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="所属角色" prop="roleCodeList">
          <el-select
            multiple
            v-model="addForm.value.roleCodeList"
            placeholder="所属角色"
            clearable
            style="width: 200px"
          >
            <el-option label="系统管理员" value="110" />
            <el-option label="设备管理员" value="101" />
            <el-option label="发布管理员" value="011" />
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
