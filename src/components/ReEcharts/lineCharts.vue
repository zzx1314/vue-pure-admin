<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});

const dataNumberArray = ref([10, 20, 20, 50, 79, 75, 100]);

const props = defineProps({
  // 数据
  data: {
    type: Array<number>,
    default: [10, 20, 20, 50, 79, 75, 100]
  }
});

const updateChartOptions = () => {
  setOptions(
    {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: dataNumberArray.value,
          type: "line",
          smooth: true
        }
      ]
    },
    {
      name: "click",
      callback: params => {
        console.log("click", params);
      }
    },
    // 点击空白处
    {
      type: "zrender",
      name: "click",
      callback: params => {
        console.log("点击空白处", params);
      }
    }
  );
};

watch([() => props.data], ([newV]) => {
  dataNumberArray.value = newV;
  updateChartOptions();
});

// 初始化图表选项
updateChartOptions();
</script>

<template>
  <div ref="lineChartRef" style="width: 100%; height: 30vh" />
</template>
