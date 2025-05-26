<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, watch } from "vue";
import { ListItem, noticesData, TabItem } from "./data";
import NoticeList from "./components/NoticeList.vue";
import BellIcon from "@iconify-icons/ep/bell";
import { pSysMessageList } from "@/api/pSysMessage";
import { SUCCESS } from "@/api/base";
import HandlerMessageForm from "@/views/system/sysMessage/HandlerMessageForm.vue";
import { useMessageStoreHook } from "@/store/modules/message";

const { t } = useI18n();
const noticesNum = ref(0);
const notices = ref<TabItem[]>(noticesData);
const activeKey = ref(noticesData[0]?.key);
const dialogFormVisible = ref(false);
const messageId = ref(null);

notices.value.map(v => (noticesNum.value += v.list.length));

const getLabel = computed(
  () => item =>
    t(item.name) + (item.list.length > 0 ? `(${item.list.length})` : "")
);

function getMessage() {
  pSysMessageList().then(res => {
    notices.value[0].list = [];
    console.log("消息列表:", res.data);
    /* if (res.code == SUCCESS && res.data) {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].extra === "待处置") {
          notices.value[0].list.push(res.data[i]);
        }
      }
      noticesNum.value = notices.value[0].list.length;
      console.log("notices.value:", notices.value);
    }*/
  });
}

const handlerItem = (item: ListItem) => {
  console.log("Received item:", item);
  dialogFormVisible.value = true;
  messageId.value = item.id;
};

function closeDia() {
  dialogFormVisible.value = false;
  getMessage();
}

const messageStore = useMessageStoreHook();
watch(
  [() => messageStore.deleteMessage, () => messageStore.handleMessage],
  ([newValue, newHandleMessage]) => {
    if (newValue) {
      messageStore.deleteMessage = false;
      getMessage();
    }
    if (newHandleMessage) {
      messageStore.handleMessage = false;
      getMessage();
    }
  }
);

onMounted(() => {
  console.log("onMounted");
  getMessage();
});
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span
      :class="[
        'dropdown-badge',
        'navbar-bg-hover',
        'select-none',
        Number(noticesNum) !== 0 && 'mr-[10px]'
      ]"
    >
      <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeKey"
          :stretch="true"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            :description="t('status.pureNoMessage')"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane :label="getLabel(item)" :name="`${item.key}`">
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList
                      :list="item.list"
                      :emptyText="item.emptyText"
                      @list-change="handlerItem"
                    />
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <handler-message-form
    :id="messageId"
    :dialogFormVisible="dialogFormVisible"
    title="消息处置"
    @update:dialogFormVisible="closeDia"
  />
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
