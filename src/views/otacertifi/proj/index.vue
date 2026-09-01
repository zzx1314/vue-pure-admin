<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useProj } from "@/views/otacertifi/proj/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import mindMap from "@iconify-icons/ri/mind-map";
import secure from "@iconify-icons/ri/secure-payment-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import { hasAuth } from "@/router/utils";

const formRef = ref();
const addFormRef = ref<FormInstance>();

const {
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  dialogFormVisible,
  dialogFormVisibleApprove,
  title,
  addForm,
  rules,
  moreCondition,
  customerList,
  middlemanList,
  featureList,
  approverOptions,
  cancel,
  restartForm,
  submitForm,
  submitFormApprover,
  openDia,
  onSearch,
  handleUpdate,
  handleUpdateApprove,
  handleDelete,
  handleAuthorize,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useProj();

defineOptions({
  name: "项目管理"
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="客户账号" prop="name">
        <el-input
          v-model="queryForm.userName"
          placeholder="请输入客户账号"
          maxlength="15"
          show-word-limit
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item label="所属中间商" prop="name">
        <el-input
          v-model="queryForm.middlemanName"
          placeholder="请输入所属中间商账号"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryForm.projName"
          placeholder="请输入项目名称"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item label="特性名称" prop="name">
        <el-input
          v-model="queryForm.featuresName"
          placeholder="请输入特性名称"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>
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
        <el-button :icon="useRenderIcon(Refresh)" @click="restartForm(formRef)">
          重置
        </el-button>
        <el-button
          link
          :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
          type="primary"
          @click="moreCondition = !moreCondition"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="项目列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('proj_add')"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增项目', addFormRef)"
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
          <template #content="{ row }">
            <span v-html="row.featuresName" />
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="
                row.useLicNum > 0 &&
                row.approvalStatus !== 1 &&
                row.approvalStatus !== 4
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(mindMap)"
              @click="handleUpdateApprove(row, addFormRef)"
            >
              变更审批
            </el-button>
            <el-button
              v-if="row.featuresId === '11'"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(secure)"
              @click="handleAuthorize(row)"
            >
              源码授权
            </el-button>
            <el-button
              v-if="hasAuth('proj_update') && row.useLicNum === 0"
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
                  v-if="
                    hasAuth('proj_del') &&
                    row.approvalStatus !== 1 &&
                    row.approvalStatus !== 4
                  "
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

    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      width="750px"
      @close="cancel"
    >
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
            style="width: 200px"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="项目编码" prop="projCode">
          <el-input
            v-model="addForm.value.projCode"
            style="width: 200px"
            placeholder="请输入项目编码（最多15字节）"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="外部客户端" prop="isExternalClient">
          <el-checkbox
            v-model="addForm.value.isExternalClient"
            :true-value="1"
            :false-value="0"
          >
            外部客户端（授权点数和授权时间由客户端设置）
          </el-checkbox>
        </el-form-item>
        <el-form-item label="最终授权账号" prop="customerId">
          <el-select
            v-model="addForm.value.customerId"
            clearable
            placeholder="请选择最终授权账号"
            style="width: 200px"
          >
            <el-option
              v-for="item in customerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属中间商" prop="middlemanId">
          <el-select
            v-model="addForm.value.middlemanId"
            clearable
            placeholder="请选择所属中间商"
            style="width: 200px"
          >
            <el-option
              v-for="item in middlemanList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="特性名称" prop="featuresIdArray">
          <el-select
            v-model="addForm.value.featuresIdArray"
            multiple
            clearable
            placeholder="请选择特性"
            style="width: 200px"
          >
            <el-option
              v-for="item in featureList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授权数量" prop="liceNum">
          <el-input
            v-model="addForm.value.liceNum"
            placeholder="请输入授权数量"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="授权时长" prop="liceTime">
          <el-select
            v-model="addForm.value.liceTime"
            placeholder="请选择授权时长"
            style="width: 200px"
          >
            <el-option label="30天" value="30" />
            <el-option label="3个月" value="90" />
            <el-option label="6个月" value="180" />
            <el-option label="1年" value="365" />
            <el-option label="3年" value="1095" />
            <el-option label="5年" value="1825" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogFormVisibleApprove"
          label="审批人"
          prop="approverId"
        >
          <el-select
            v-model="addForm.value.approverId"
            style="width: 200px"
            placeholder="请选择审批人"
          >
            <el-option
              v-for="item in approverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addForm.value.remark"
            type="textarea"
            style="width: 200px"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button
            v-if="dialogFormVisibleApprove"
            type="primary"
            @click="submitFormApprover(addFormRef)"
            >发起审批</el-button
          >
          <el-button v-else type="primary" @click="submitForm(addFormRef)"
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
