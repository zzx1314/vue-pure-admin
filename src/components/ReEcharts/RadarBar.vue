<template>
  <div class="corner">
    <span class="bottom-left" />
    <span class="bottom-right" />
    <div class="title">【云端报警风险】</div>
    <div ref="target" class="w-full h-full" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
// 定义接收父组件传来的值
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
// console.log(props.data);
// 1.初始化
let myChart = null;
const target = ref(null);
onMounted(() => {
  myChart = echarts.init(target.value);
  renderChart();
});

// 2.构建 option 配置对象
const renderChart = () => {
  const options = {
    // 雷达图坐标系配置
    radar: {
      name: {
        textStyle: {
          color: "#05D5FF",
          fontSize: 14
        }
      },
      shape: "polygon",
      center: ["50%", "50%"],
      radius: "80%",
      startAngle: 120,
      // 轴线
      axisLine: {
        lineStyle: {
          color: "rgba(2,213,255,.8)"
        }
      },
      // 网格线
      splitLine: {
        show: true,
        lineStyle: {
          with: 1,
          color: "rgba(5,213,255,.8)"
        }
      },
      // 指示器名称
      indicator: props.data.risks.map(item => ({
        name: item.name,
        max: 100
      })),
      splitArea: {
        show: false
      }
    },
    // 位置、极点
    polar: {
      center: ["50%", "50%"],
      radius: "0%"
    },
    // 坐标角度
    angleAxis: {
      min: 0,
      interval: 5,
      clockwise: false //刻度逆时针
    },
    // 径向轴
    radiusAxis: {
      min: 0,
      interval: 20,
      splitLine: {
        show: true
      }
    },
    // 图表核心配置
    series: {
      type: "radar",
      symbol: "circle",
      symbolSize: 10,
      itemStyle: {
        normal: {
          color: "#05D5FF"
        }
      },
      areaStyle: {
        normal: {
          color: "#05D5FF",
          opacity: 0.5
        }
      },
      lineStyle: {
        with: 2,
        color: "#05D5FF"
      },
      label: {
        normal: {
          show: true,
          color: "#05D5FF"
        }
      },
      data: [
        {
          value: props.data.risks.map(item => item.value)
        }
      ]
    }
  };
  // 3.通过实例.setOptions(option)
  myChart.setOption(options);
};
watch(() => props.data, renderChart);
</script>
