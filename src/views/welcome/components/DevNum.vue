<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
import * as echarts from "echarts/core";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>, {
  theme
});

const props = defineProps({
  groupNames: {
    type: Array<string>,
    default: () => ["测试组1", "测试组2"]
  },
  onlineNums: {
    type: Array<number>,
    default: () => [10, 15]
  },
  offlineNums: {
    type: Array<number>,
    default: () => [2, 3]
  }
});

setOptions(
  {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      bottom: "20px",
      right: "10px"
    },
    legend: {
      //@ts-expect-error
      right: true,
      data: ["在线设备", "离线设备"]
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0
          // width: "70",
          // overflow: "truncate"
        },
        data: props.groupNames,
        triggerEvent: true
      }
    ],
    yAxis: [
      {
        type: "value",
        triggerEvent: true
      }
    ],
    series: [
      {
        name: "在线设备",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#3ce6ab"
            },
            {
              offset: 1,
              color: "#3ce675"
            }
          ])
        },
        data: props.onlineNums
      },
      {
        name: "离线设备",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#f56c6c"
            },
            {
              offset: 1,
              color: "#f89898"
            }
          ])
        },
        data: props.offlineNums
      }
    ],
    addTooltip: true
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  }
);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="barChartRef" style="width: 100%; height: 35vh" />
</template>
