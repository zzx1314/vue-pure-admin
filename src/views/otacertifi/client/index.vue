<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { useClient } from "@/views/otacertifi/client/hook";
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "Client"
});

const formRef = ref();
const addFormRef = ref<FormInstance>();
const treeRef = ref(null);

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
  caInfo,
  getCerInfo,
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
} = useClient();

interface ClientCa {
  id: number;
  label: string;
  children?: ClientCa[];
}

const handleNodeClick = (data: ClientCa) => {
  console.log(data);
  const currentId = data.id;
  treeRef.value.setCheckedKeys([currentId]);
  getCerInfo(data.id);
};

const defaultProps = {
  children: "children",
  label: "label"
};
</script>

<template>
  <div class="main">
    <el-container>
      <el-aside width="240px">
        <div
          class="h-full bg-bg_color overflow-auto"
          :style="{ minHeight: `calc(100vh - 141px)`, paddingTop: '20px' }"
        >
          <el-tree
            ref="treeRef"
            node-key="id"
            :data="caInfo"
            :props="defaultProps"
            show-checkbox
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <el-form
          ref="formRef"
          :inline="true"
          :model="queryForm"
          class="bg-bg_color w-[99/100] pl-8 pt-4"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryForm.name"
              placeholder="请输入CA名称"
              clearable
              class="!w-[150px]"
            />
          </el-form-item>
          <el-form-item label="域名" prop="name">
            <el-input
              v-model="queryForm.domain"
              placeholder="请输入CA域名"
              clearable
              class="!w-[150px]"
            />
          </el-form-item>
          <el-form-item label="状态" prop="name">
            <el-select
              v-model="queryForm.status"
              placeholder="请输入证书状态"
              class="!w-[150px]"
            >
              <el-option label="未生效" value="未生效" />
              <el-option label="已使用" value="已使用" />
              <el-option label="已废弃" value="已废弃" />
            </el-select>
          </el-form-item>

          <el-collapse-transition>
            <div v-show="moreCondition">
              <el-form-item label="开始时间：" prop="beginTime">
                <el-date-picker
                  v-model="queryForm.beginTime"
                  type="date"
                  placeholder="请输入开始时间"
                  class="!w-[180px]"
                />
              </el-form-item>
              <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                  v-model="queryForm.endTime"
                  placeholder="请输入结束时间"
                  type="date"
                  class="!w-[180px]"
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

        <PureTableBar title="客户端证书" :columns="columns" @refresh="onSearch">
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="openDia('新增CA', addFormRef)"
            >
              添加
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
                  :icon="useRenderIcon(EditPen)"
                  @click="handleUpdate(row, addFormRef)"
                >
                  修改
                </el-button>
                <el-popconfirm
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
      </el-main>
    </el-container>

    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="projName">
          <el-input
            v-model="addForm.value.projName"
            placeholder="请输入项目名称"
          />
        </el-form-item>

        <el-form-item label="模块名称" prop="modelName">
          <el-input
            v-model="addForm.value.modelName"
            placeholder="请输入模块名称"
          />
        </el-form-item>

        <el-form-item label="CA名称" prop="name">
          <el-input v-model="addForm.value.name" placeholder="请输入设备版本" />
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="addForm.value.domain" placeholder="请输入CA域名" />
        </el-form-item>

        <el-form-item label="失效时间" prop="expiryData">
          <el-select
            v-if="addForm.value.expiryData !== '自定义'"
            v-model="addForm.value.expiryData"
            placeholder="请选择失效时间"
            class="!w-[180px]"
          >
            <el-option label="30天" value="30" />
            <el-option label="3个月" value="90" />
            <el-option label="6个月" value="180" />
            <el-option label="1年" value="365" />
            <el-option label="3年" value="1095" />
            <el-option label="5年" value="1825" />
            <el-option label="自定义" value="自定义" />
          </el-select>
          <el-date-picker
            v-else
            v-model="addForm.value.expiryData"
            type="date"
            placeholder="请输入失效时间"
            class="!w-[180px]"
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
:deep(.el-main) {
  --el-main-padding: 0;

  padding-left: 20px;
}

:deep(.el-tree-node) {
  font-weight: bold;
}
</style>
