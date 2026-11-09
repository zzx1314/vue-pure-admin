<script setup lang="ts">
import { ref } from "vue";
import { useLicenseBusDevice } from "@/views/otacertifi/device/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { DEVICE_STATUS_OPTIONS } from "@/utils/licenseDevice";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";

defineOptions({
  name: "LicenseBusDevice"
});

const formRef = ref();
const {
  queryForm,
  dataList,
  loading,
  pagination,
  columns,
  moreCondition,
  canDeactivate,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleDeactivate,
  restartForm
} = useLicenseBusDevice();
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="queryForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryForm.projName"
          placeholder="请输入项目名称"
          clearable
          class="!w-[145px]"
        />
      </el-form-item>
      <el-form-item label="激活账号" prop="name">
        <el-input
          v-model="queryForm.userName"
          placeholder="请输入激活账号"
          clearable
          class="!w-[145px]"
        />
      </el-form-item>
      <el-form-item label="设备ID" prop="name">
        <el-input
          v-model="queryForm.activationCode"
          placeholder="请输入设备ID"
          clearable
          class="!w-[145px]"
        />
      </el-form-item>
      <el-form-item label="系统版本" prop="name">
        <el-input
          v-model="queryForm.osVersion"
          placeholder="请输入系统版本"
          clearable
          class="!w-[145px]"
        />
      </el-form-item>

      <el-collapse-transition>
        <div v-show="moreCondition">
          <el-form-item label="系统架构" prop="name">
            <el-input
              v-model="queryForm.processArch"
              placeholder="请输入系统架构"
              clearable
              class="!w-[150px]"
            />
          </el-form-item>
          <el-form-item label="状态" prop="name">
            <el-select
              v-model="queryForm.cerStatus"
              placeholder="请输状态"
              class="!w-[150px]"
            >
              <el-option
                v-for="status in DEVICE_STATUS_OPTIONS"
                :key="status"
                :label="status"
                :value="status"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="激活开始时间：" prop="beginTime">
            <el-date-picker
              v-model="queryForm.beginTime"
              type="date"
              placeholder="请输入激活开始时间"
              class="!w-[180px]"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="激活结束时间：" prop="endTime">
            <el-date-picker
              v-model="queryForm.endTime"
              placeholder="请输入激活结束时间"
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

    <PureTableBar title="授权设备" :columns="columns" @refresh="onSearch">
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
              type="danger"
              :size="size"
              :disabled="!canDeactivate(row.cerStatus)"
              @click="handleDeactivate(row)"
            >
              去激活
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
