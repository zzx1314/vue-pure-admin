<template>
  <div
    class="flex flex-col h-screen bg-[url('@/assets/images/bg.png')] bg-cover bg-center text-white"
  >
    <div class="flex flex-row basis-5">
      <div
        class="flex-1 flex items-center justify-center font-sans font-bold text-[30px] text-slate-200"
      >
        采集器大屏监控
      </div>
      <div class="basis-10">
        <span class="text-[#fff]">返回</span>
      </div>
    </div>

    <div class="flex-1 p-3 flex flex-row overflow-hidden">
      <!-- left -->
      <div class="flex-1 mr-3 p-3">
        <!-- 横向柱状图 -->
        <HorizontalBar
          class="h-1/3 box-border pb-2 mb-2 bg-opacity-50 bg-slate-800"
          :data="data.regionData"
        />
        <!-- 雷达图 -->
        <RadarBar
          class="h-1/3 box-border pb-2 mb-2 bg-opacity-50 bg-slate-800"
          :data="data.riskData"
        />
        <!-- 饼图 -->
        <PieEcharts
          class="h-1/3 bg-opacity-50 bg-slate-800"
          :data="data.pieData.datas"
        />
      </div>
      <!-- center -->
      <div class="w-1/2 mr-3 flex flex-col">
        <!-- 数据总览图 -->
        <TotalData
          class="bg-opacity-50 bg-slate-800 p-3"
          :data="data.totalData"
        />
        <!-- 地图可视化 -->
        <MapChart
          class="bg-opacity-50 bg-slate-800 p-3 mt-3 flex-1"
          :data="data.mapData"
        />
      </div>
      <!-- right -->
      <div class="flex-1 p-3 flex flex-col">
        <!-- 竖向柱状图 -->
        <VerticalBar
          class="h-1/3 box-border pb-2 mb-2 bg-opacity-50 bg-slate-800"
          :data="data.serverData"
        />
        <!-- 环形图 -->
        <RingBar
          class="h-1/3 box-border pb-2 mb-2 bg-opacity-50 bg-slate-800"
          :data="data.abnormalData"
        />
        <!-- 折线图-->
        <line-charts
          class="h-1/3 bg-opacity-50 bg-slate-800"
          :data="data.lineChartData.datas"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import HorizontalBar from "@/components/ReEcharts/HorizontalBar.vue";
import RadarBar from "@/components/ReEcharts/RadarBar.vue";
import TotalData from "@/components/ReEcharts/TotalData.vue";
import MapChart from "@/components/ReEcharts/MapChart.vue";
import VerticalBar from "@/components/ReEcharts/VerticalBar.vue";
import RingBar from "@/components/ReEcharts/RingBar.vue";
import LineCharts from "@/components/ReEcharts/lineCharts.vue";
import PieEcharts from "@/components/ReEcharts/pieEcharts.vue";

import { reactive, ref } from "vue";
import { throttleTimeAndTimer } from "./utils/utils";

// 本地mock数据
import mockData from "./utils/mockData";

let _mockData = reactive(mockData);

// 加载状态
const loading = ref(true);

const data = ref(null);
const loadData = async () => {
  //data.value = await getVisualization();
  data.value = _mockData;
  loading.value = false;
  console.log("数据：", data.value);
};
loadData();

// 获取宽度
const windowSize = () => {
  loading.value = true;
};
// window.addEventListener("resize", windowSize);
window.onresize = () => {
  // 页面大小变化时，刷新页面
  windowSize();
  throttleTimeAndTimer(window.history.go(0), 500);
};
windowSize();

setInterval(() => {
  loadData();
}, 3000);
</script>

<style scoped lang="scss">
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
