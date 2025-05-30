<script setup lang="ts">
import { usePSysMessage } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useSysMessageForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusSearch } from "plus-pro-components";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import HandlerMessageForm from "@/views/system/sysMessage/HandlerMessageForm.vue";
import { ref } from "vue";
import { useMessageStoreHook } from "@/store/modules/message";
import { hasAuth } from "@/router/utils";

defineOptions({
  name: "PSysMessage"
});

const { columnsQueryForm } = useSysMessageForm();
const messageId = ref(null);
const dialogFormVisible = ref(false);

function closeDia() {
  dialogFormVisible.value = false;
  messageId.value = null;
  useMessageStoreHook().handleMessage = true;
  onSearch();
}

const handlerItem = item => {
  console.log("Received item:", item);
  dialogFormVisible.value = true;
  messageId.value = item.id;
};

const {
  queryForm,
  dataList,
  loading,
  pagination,
  columns,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  cancel
} = usePSysMessage();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="3"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      />
    </el-card>
    <PureTableBar title="消息列表" :columns="columns" @refresh="onSearch">
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
              v-if="hasAuth('message_handler')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handlerItem(row)"
            >
              处置
            </el-button>
            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  v-if="hasAuth('message_delete')"
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

    <handler-message-form
      :id="messageId"
      :dialogFormVisible="dialogFormVisible"
      title="消息处置"
      @update:dialogFormVisible="closeDia"
    />
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
