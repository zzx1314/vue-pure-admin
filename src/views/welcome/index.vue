<script setup lang="ts">
import Bar from "./components/Bar.vue";
import Pie from "./components/Pie.vue";
import DevNum from "@/views/welcome/components/DevNum.vue";
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, getCurrentInstance, onMounted } from "vue";
import Github from "./components/Github.vue";
import { devStatistics } from "@/api/otaDev";
import { resStatistics } from "@/api/otaRes";
import { taskStatistics } from "@/api/otaTask";

defineOptions({
  name: "Welcome"
});

const list = ref();
const loading = ref<boolean>(true);
const { version } = __APP_INFO__.pkg;

// 设备统计
const groupNames = ref([]);
const onlineNums = ref([]);
const offlineNums = ref([]);
// 资源统计
const resInfo = ref([]);
// 任务统计
const time = ref([]);
const overNumber = ref([]);
const unOverNumber = ref([]);

const { VersionList } =
  getCurrentInstance().appContext.config.globalProperties.$config;
console.log("VersionList：", VersionList);
list.value = VersionList;

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

const getDevStatistics = () => {
  devStatistics().then(res => {
    console.log(res);
    groupNames.value = res.data.groupNames;
    onlineNums.value = res.data.onlineNums;
    offlineNums.value = res.data.offlineNums;
  });
};

const getResStatistics = () => {
  resStatistics().then(res => {
    console.log(res);
    resInfo.value = res.data;
  });
};

const getTaskStatistics = () => {
  taskStatistics().then(res => {
    console.log(res);
    time.value = res.data.time;
    overNumber.value = res.data.overNums;
    unOverNumber.value = res.data.offlineNums;
  });
};

onMounted(() => {
  getDevStatistics();
  getResStatistics();
  getTaskStatistics();
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
                strings: ['接入设备信息'],
                cursor: false,
                speed: 120
              }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <DevNum
                :group-names="groupNames"
                :online-nums="onlineNums"
                :offline-nums="offlineNums"
              />
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
              :options="{ strings: ['资源信息'], cursor: false, speed: 120 }"
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
              :options="{ strings: ['任务信息'], cursor: false, speed: 120 }"
            />
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Bar
                :time="time"
                :over-number="overNumber"
                :un-over-number="unOverNumber"
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
