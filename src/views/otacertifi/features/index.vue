<script setup lang="ts">
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import { useProd } from "@/views/otacertifi/features/hook";
import { hasAuth } from "@/router/utils";
import { maxUtf8BytesRule } from "@/utils/byteLength";

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
  handleSelectionChange,
  objectSpanMethod
} = useProd();

defineOptions({
  name: "特性管理"
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
      <el-form-item label="特性名称" prop="prodName">
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
          @click="moreCondition = !moreCondition"
        />
      </el-form-item>
    </el-form>

    <PureTableBar title="特性列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('features_add')"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDia('新增特性', addFormRef)"
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
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('features_update')"
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
                  v-if="hasAuth('features_del')"
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
      width="500px"
      @close="cancel"
    >
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="特性名称" prop="featuresName">
          <el-input
            v-model="addForm.value.featuresName"
            :disabled="title == '修改'"
            placeholder="请输入特性名称（最多15字节）"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>

        <!--        <el-form-item label="特性版本" prop="featuresVersion">
          <el-input
            v-model="addForm.value.featuresVersion"
            placeholder="请输入特性版本"
          />
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addForm.value.remark"
            type="textarea"
            placeholder="请输入备注"
          />
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
