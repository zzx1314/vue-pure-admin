<script setup lang="ts">
import { useOBusLogs } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusSearch } from "plus-pro-components";
import More from "@iconify-icons/ep/more-filled";
import History from "@iconify-icons/ri/chat-history-line";
import Download from "@iconify-icons/ri/download-line";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import ArrowUp from "@iconify-icons/ep/arrow-up-bold";
import ArrowDown from "@iconify-icons/ri/arrow-down-s-line";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "OBusLogs"
});

const { columnsQueryForm, columnsQueryHistoryForm } = useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  dataListHistory,
  loading,
  pagination,
  columns,
  columnsHistory,
  dialogHistoryLogVisible,
  onSearch,
  onSearchHistory,
  handleDelete,
  handleHistoryDelete,
  handleSizeChange,
  handleSizeChangeHistory,
  handleCurrentChange,
  handleCurrentChangeHistory,
  handleSelectionChange,
  handleSelectionChangeHistory,
  handleDialogClosed,
  handleDownloadLog,
  cancel,
  cancelHistory,
  openDia
} = useOBusLogs();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="4"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      >
        <template
          #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
        >
          <div style="display: flex">
            <el-button
              type="primary"
              :icon="useRenderIcon(Search)"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button :icon="useRenderIcon(Refresh)" @click="handleReset"
              >重置</el-button
            >
            <el-button
              type="primary"
              :icon="
                isShowUnfold ? useRenderIcon(ArrowUp) : useRenderIcon(ArrowDown)
              "
              link
              @click="handleUnfold"
            >
              {{ isShowUnfold ? "收起" : "展开" }}
            </el-button>
          </div>
        </template>
      </PlusSearch>
    </el-card>
    <PureTableBar title="日志列表" :columns="columns" @refresh="onSearch">
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
              v-if="hasAuth('find_history_log')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(History)"
              @click="openDia(row)"
            >
              历史日志
            </el-button>
            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  v-if="hasAuth('delete_history_log')"
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
                      v-if="hasAuth('down_log')"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Download)"
                      @click="handleDownloadLog(row)"
                    >
                      下载
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog
      v-model="dialogHistoryLogVisible"
      title="历史日志"
      class="shellDialog"
      fullscreen
      @close="handleDialogClosed"
    >
      <el-card>
        <PlusSearch
          v-model="queryForm"
          :columns="columnsQueryHistoryForm"
          :show-number="2"
          label-width="80"
          label-position="right"
          @search="onSearchHistory"
          @reset="cancelHistory"
        />
      </el-card>
      <PureTableBar
        title="日志列表"
        :columns="columnsHistory"
        @refresh="onSearchHistory"
      >
        <template v-slot="{ size, checkList, dynamicColumns }">
          <pure-table
            border
            adaptive
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataListHistory"
            :columns="dynamicColumns"
            :checkList="checkList"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChangeHistory"
            @page-size-change="handleSizeChangeHistory"
            @page-current-change="handleCurrentChangeHistory"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(Download)"
                @click="handleDownloadLog(row)"
              >
                下载
              </el-button>
              <el-popconfirm
                title="是否确认删除?"
                @confirm="handleHistoryDelete(row)"
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
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-link) {
  padding-left: 10px;
}
</style>
