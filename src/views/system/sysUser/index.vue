<script setup lang="ts">
import { ref, onMounted } from "vue";
import tree from "./tree.vue";
import { useUser } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { listAllRole } from "@/api/system";

import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import { DynamicForm } from "@/components/ReForm/main";

const {
  formRef,
  moreCondition,
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  buttonClass,
  roleArry,
  formOptions,
  setOrgId,
  setOrgIds,
  onReady,
  openDia,
  onSearch,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  resetPwd,
  queryInfo,
  resetForm
} = useUser();

defineOptions({
  name: "sysUser"
});

onMounted(() => {
  getAllRole();
});

// 获取所有角色列表
async function getAllRole() {
  const { data } = await listAllRole();
  const allCheckItem = ref([]);
  data.map(item => {
    allCheckItem.value.push({ text: item.name, value: item.id });
  });
  roleArry.value.push(...allCheckItem.value);
}
</script>

<template>
  <div class="main">
    <tree
      class="w-[17%] float-left"
      @updatePage="onSearch"
      @setOrgId="setOrgId"
      @setOrgIds="setOrgIds"
    />
    <div class="float-right w-[81%]">
      <div style="display: inline-flex">
        <DynamicForm
          ref="formRef"
          :options="formOptions"
          :model="queryForm"
          class="demo-form-inline"
          @ready="onReady"
        >
          <template #formCeil="{ item }">
            <template v-if="item.name == 'moreQuery'">
              <div class="demo-row">
                <el-collapse-transition>
                  <div v-show="moreCondition">
                    <el-form-item label="开始时间：" prop="beginTime">
                      <el-date-picker
                        v-model="queryForm.beginTime"
                        type="date"
                        placeholder="请输入开始时间"
                        class="!w-[200px]"
                      />
                    </el-form-item>
                    <el-form-item label="结束时间：" prop="endTime">
                      <el-date-picker
                        v-model="queryForm.endTime"
                        placeholder="请输入结束时间"
                        type="date"
                        class="!w-[200px]"
                      />
                    </el-form-item>
                  </div>
                </el-collapse-transition>
              </div>
            </template>
          </template>
        </DynamicForm>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="queryInfo"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm()">
          重置
        </el-button>
      </div>
      <el-button
        link
        class="mc-btn"
        @click="moreCondition = !moreCondition"
        :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
      />
      <PureTableBar title="用户管理" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDia('添加用户')"
          >
            新增
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
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
                @click="handleUpdate(row)"
                :icon="useRenderIcon(EditPen)"
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
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                        @click="resetPwd(row)"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

.demo-row {
  margin-top: 10px;
}

.mc-btn {
  width: 100%;
  height: 17px;
  padding: 0;
  color: #c0c4cc;
}

.mc-btn:hover {
  background-color: #f2f6fc;
}

// .el-button:hover {
//   background: #f2f6fc !important;
//   color: rgb(54, 77, 223) !important;
//   font-weight: bold;
//   border-color: #f2f6fc !important;
// }
</style>
