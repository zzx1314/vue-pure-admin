<script setup lang="ts">
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, getCurrentInstance, onMounted } from "vue";
import Github from "./components/Github.vue";
import Bar from "@/views/welcome/components/Bar.vue";
import Pie from "@/views/welcome/components/Pie.vue";
import DevNum from "@/views/welcome/components/DevNum.vue";
import { statisticsCommandByStatus } from "@/api/oBusCommand";
import { statisticsDeviceByType, statisticsOnOrOffine } from "@/api/oBusDevice";

defineOptions({
  name: "Welcome"
});

const list = ref();
const loading = ref<boolean>(true);
const { version } = __APP_INFO__.pkg;

// 设备统计
const groupNames = ref(["在线", "心跳丢失", "离线"]);
const onlineNums = ref([
  {
    value: 0,
    itemStyle: {
      color: "#67C23A"
    }
  },
  {
    value: 0,
    itemStyle: {
      color: "#E6A23C"
    }
  },
  {
    value: 0,
    itemStyle: {
      color: "#F56C6C"
    }
  }
]);
// 设备类型统计
const resInfo = ref([]);
// 指令统计
const commandType = ref(["已下发", "执行成功", "执行失败", "响应超时"]);
const commandTypeNumber = ref([
  {
    value: 0,
    itemStyle: {
      color: "#E6A23C"
    }
  },
  {
    value: 0,
    itemStyle: {
      color: "#67C23A"
    }
  },
  {
    value: 0,
    itemStyle: {
      color: "#F56C6C"
    }
  },
  {
    value: 0,
    itemStyle: {
      color: "#9f0429"
    }
  }
]);

const { VersionList } =
  getCurrentInstance().appContext.config.globalProperties.$config;
console.log("VersionList：", VersionList);
list.value = VersionList;

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

const getDevStatisticsOnOrOffine = () => {
  statisticsOnOrOffine().then(res => {
    console.log(res);
    if (res.data) {
      onlineNums.value[0].value = res.data.online ? res.data.online : 0;
      onlineNums.value[1].value = res.data.missHeartBeat
        ? res.data.missHeartBeat
        : 0;
      onlineNums.value[2].value = res.data.offline ? res.data.offline : 0;
    }
  });
};

const getResStatisticsByStatus = () => {
  statisticsDeviceByType().then(res => {
    console.log(res);
    if (res.data) {
      resInfo.value = res.data;
    }
  });
};

const getCommandStatistics = () => {
  statisticsCommandByStatus().then(res => {
    console.log(res);
    if (res.data) {
      commandTypeNumber.value[0].value = res.data.issued ? res.data.issued : 0;
      commandTypeNumber.value[1].value = res.data.success
        ? res.data.success
        : 0;
      commandTypeNumber.value[2].value = res.data.failed ? res.data.failed : 0;
      commandTypeNumber.value[3].value = res.data.reportTime
        ? res.data.reportTime
        : 0;
    }
  });
};

onMounted(() => {
  getDevStatisticsOnOrOffine();
  getResStatisticsByStatus();
  getCommandStatistics();
});
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card
          shadow="never"
          :style="{ height: `calc(${height}px - 35vh - 250px)` }"
        >
          <template #header>
            <TypeIt
              :options="{
                strings: [`版本日志（当前版本 v${version}）`],
                cursor: false,
                speed: 120
              }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar :height="`calc(${height}px - 35vh - 340px)`">
                <el-timeline v-show="list?.length > 0">
                  <el-timeline-item
                    v-for="(item, index) in list"
                    :key="index"
                    :icon="item.icon"
                    :type="item.type"
                    :color="item.color"
                    :size="item.size"
                    :hollow="item.hollow"
                    :timestamp="item.timestamp"
                  >
                    {{ item.content }}
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-show="list?.length === 0" />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card
          shadow="never"
          :style="{ height: `calc(${height}px - 35vh - 250px)` }"
        >
          <template #header>
            <TypeIt
              :options="{ strings: ['系统信息'], cursor: false, speed: 120 }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar :height="`calc(${height}px - 35vh - 340px)`">
                <Github />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <TypeIt
              :options="{
                strings: ['设备状态统计'],
                cursor: false,
                speed: 120
              }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <DevNum :group-names="groupNames" :online-nums="onlineNums" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <TypeIt
              :options="{
                strings: ['设备类型统计'],
                cursor: false,
                speed: 120
              }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Pie :resInfo="resInfo" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        v-motion
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <TypeIt
              :options="{
                strings: ['指令信息统计'],
                cursor: false,
                speed: 120
              }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <DevNum
                :group-names="commandType"
                :online-nums="commandTypeNumber"
              />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
