<template>
  <!-- echarts 的容器 -->
  <div ref="barRef" :style="`width:${width};height:${height};`" />
</template>

<script setup>
import useEchart from "./hooks/useEchart";
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  },
  chargingStatisticsData: {
    type: Array,
    default() {
      return [];
    }
  }
});
const barRef = ref();
let myChart = null;

onMounted(() => {
  setChart(props.chargingStatisticsData);
});

watch(
  () => props.chargingStatisticsData,
  newVal => {
    console.log("watch");
    setChart(newVal);
  },
  { deep: true }
);
const setChart = (echartDatas = []) => {
  if (myChart) {
    let options = getOption(echartDatas);
    myChart.setOption(options);
    myChart.resizeEchart();
  } else {
    myChart = useEchart(barRef.value);
    let options = getOption(echartDatas);
    myChart.setOption(options);
    myChart.resizeEchart();
  }
};

const getOption = (echartDatas = []) => {
  const category = echartDatas.map(item => {
    return item.name;
  });
  const categoryData = echartDatas.map(item => {
    return item.value;
  });

  const option = {
    grid: {
      left: "5%",
      right: "5%",
      top: "30%",
      bottom: "5%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    tooltip: {},
    xAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF"
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "white"
      },

      data: category
    },
    yAxis: {
      name: "个",
      nameTextStyle: {
        color: "white",
        fontSize: 13
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF"
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF"
        }
      },
      axisLabel: {
        color: "white"
      }
    },
    series: [
      {
        name: "销量",
        type: "bar",
        barWidth: 17,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#01B1FF" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#033BFF" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        data: categoryData
      }
    ]
  };

  return option;
};
</script>
