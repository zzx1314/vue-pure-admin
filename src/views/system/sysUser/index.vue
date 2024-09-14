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
import { hasAuth } from "@/router/utils";

const {
  moreCondition,
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  buttonClass,
  roleArry,
  sexArray,
  dialogFormVisible,
  title,
  rules,
  addForm,
  adaptiveConfig,
  cancel,
  setOrgId,
  setOrgIds,
  setOrgName,
  openDia,
  onSearch,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  resetPwd,
  restartForm,
  addFormInfo
} = useUser();

defineOptions({
  name: "sysUser"
});

onMounted(() => {
  getAllRole();
});

const addFormRef = ref();
const formRef = ref();

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
      @setOrgName="setOrgName"
    />
    <div class="float-right w-[81%]">
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryForm"
        class="bg-bg_color w-[99/100] pl-8 pt-4"
      >
        <el-form-item label="账号" prop="realName">
          <el-input
            v-model="queryForm.username"
            placeholder="请输入用户名"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="realName">
          <el-input
            v-model="queryForm.realName"
            placeholder="请输入用户名"
            clearable
            class="!w-[150px]"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select
            v-model="queryForm.role"
            placeholder="请选择角色"
            style="width: 150px"
          >
            <el-option
              v-for="item in roleArry"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="queryForm.sex"
            placeholder="请选择性别"
            style="width: 150px"
          >
            <el-option
              v-for="item in sexArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->

        <el-collapse-transition>
          <div v-show="moreCondition">
            <el-form-item label="开始时间：" prop="beginTime">
              <el-date-picker
                v-model="queryForm.beginTime"
                type="date"
                placeholder="请输入开始时间"
                class="!w-[180px]"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
              <el-date-picker
                v-model="queryForm.endTime"
                placeholder="请输入结束时间"
                type="date"
                class="!w-[180px]"
                value-format="YYYY-MM-DD"
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
          <el-button
            :icon="useRenderIcon(Refresh)"
            @click="restartForm(formRef)"
          >
            重置
          </el-button>

          <el-button
            type="text"
            :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
            @click="moreCondition = !moreCondition"
          />
        </el-form-item>
      </el-form>
      <PureTableBar title="用户管理" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            v-if="hasAuth('user_add')"
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDia('添加用户', addFormRef)"
          >
            新增
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            adaptive
            :adaptiveConfig="adaptiveConfig"
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
                v-if="hasAuth('user_update') && row.isEdit"
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
                v-if="hasAuth('user_del') && row.isEdit"
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
              <el-dropdown v-if="hasAuth('re_set_pass')">
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

      <el-dialog v-model="dialogFormVisible" :title="title" width="60%">
        <el-form
          ref="addFormRef"
          :model="addForm"
          :inline="true"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="addForm.realName" placeholder="请输入姓名" />
          </el-form-item>
          <!--          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="addForm.sex"
              placeholder="请选择性别"
              style="width: 200px"
            >
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>-->

          <el-form-item label="状态" prop="lockFlag">
            <el-select
              v-model="addForm.lockFlag"
              style="width: 200px"
              placeholder="请选择状态"
            >
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="addForm.role"
              style="width: 200px"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in roleArry"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="orgId">
            <el-input v-model="addForm.orgName" disabled />
          </el-form-item>

          <el-form-item
            v-if="title === '添加用户'"
            label="密码"
            prop="newpassword"
          >
            <el-input v-model="addForm.newpassword" type="password" />
          </el-form-item>
          <el-form-item
            v-if="title === '添加用户'"
            label="确认密码"
            prop="newpassword1"
          >
            <el-input v-model="addForm.newpassword1" type="password" />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel()">取消</el-button>
            <el-button type="primary" @click="addFormInfo(addFormRef)"
              >确认</el-button
            >
          </span>
        </template>
      </el-dialog>
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
  display: inline-flex;
  padding-top: 5px;
  padding-left: 5px;
  background: white;
}

.search-top {
  display: inline-flex;
  height: 56px;
  padding-top: 10px;
  padding-left: 10px;
  background: white;
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
</style>
