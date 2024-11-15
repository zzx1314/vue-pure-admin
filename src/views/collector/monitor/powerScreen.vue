<template>
  <div class="power-screen">
    <div class="header" />
    <div class="left-top">
      <PieEcharts :saturation-ratio-data="chargingPile" />
    </div>
    <div class="left-bottom">
      <LineCharts :process-data="processMonitoring" />
    </div>
    <div class="right-top">
      <RightTop :panelItems="chargingTop4" :percentage="percentage" />
    </div>
    <div class="right-center">
      <BarEcharts :charging-statistics-data="chargingStatistics" />
    </div>
    <div class="right-bottom">
      <RightBottomSvg :exception-data="exceptionMonitoring" />
    </div>
    <div class="center">
      <CenterSvg />
    </div>
    <div class="bottom">
      <BottomPanel :panelItems="dataAnalysis" />
    </div>
  </div>
</template>
<script setup>
import PieEcharts from "@/components/ReEcharts/pieEcharts.vue";
import LineCharts from "@/components/ReEcharts/lineCharts.vue";
import BarEcharts from "@/components/ReEcharts/barCharts.vue";
import RightBottomSvg from "@/components/ReEcharts/RightBottomSvg.vue";
import RightTop from "@/components/ReEcharts/RightTop.vue";
import BottomPanel from "@/components/ReEcharts/bottom-panel.vue";
import CenterSvg from "@/components/ReEcharts/center-svg.vue";
import {
  chargingPileData,
  processMonitoringData,
  chargingStatisticsData,
  exceptionMonitoringData,
  dataAnalysisData,
  chargingTop4Data
} from "./config/home-data";
import { ref } from "vue";

// 充电桩饱和比例
let chargingPile = ref(chargingPileData);
// 流程监控
let processMonitoring = ref(processMonitoringData);
// 充电桩数据分析
let chargingStatistics = ref(chargingStatisticsData);
// 异常监控
let exceptionMonitoring = ref(exceptionMonitoringData);
// 充电桩数据分析
let dataAnalysis = ref(dataAnalysisData);
// 充电桩Top4占比
let chargingTop4 = ref(chargingTop4Data);
let percentage = ref(0);
</script>

<style scoped lang="scss">
.power-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .header {
    position: absolute;
    top: 21px;
    right: 0;
    left: 0;
    height: 56px;
    background-image: url("@/assets/images/bg_header.svg");
    background-repeat: no-repeat;
  }

  .left-top {
    position: absolute;
    top: 116px;
    left: 16px;
    width: 536px;
    height: 443px;
    background-image: url("/src/assets/images/bg_left-top.svg");
    background-repeat: no-repeat;
  }

  .left-bottom {
    position: absolute;
    bottom: 49px;
    left: 16px;
    width: 536px;
    height: 443px;
    background-image: url("/src/assets/images/bg_left_bottom.svg");
    background-repeat: no-repeat;
  }

  .right-top {
    position: absolute;
    top: 96px;
    right: 17px;
    width: 519px;
    height: 327px;
    background-image: url("/src/assets/images/bg_right_top.svg");
    background-repeat: no-repeat;
  }

  .right-center {
    position: absolute;
    top: 443px;
    right: 17px;
    width: 519px;
    height: 327px;
    background-image: url("/src/assets/images/bg_right_center.svg");
    background-repeat: no-repeat;
  }

  .right-bottom {
    position: absolute;
    right: 17px;
    bottom: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 519px;
    height: 242px;
    background-image: url("/src/assets/images/bg_right_bottom.svg");
    background-repeat: no-repeat;
  }

  .center {
    position: absolute;
    right: 540px;
    bottom: 272px;
    width: 823px;
    height: 710px;

    /* border: 5px solid pink; */
  }

  .bottom {
    position: absolute;
    right: 540px;
    bottom: 49px;
    width: 823px;
    height: 209px;
    background-image: url("/src/assets/images/bg_bottom.svg");
    background-repeat: no-repeat;
  }
}
</style>
