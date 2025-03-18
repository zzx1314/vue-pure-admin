<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});

const dataNumberXArray = ref([]);
const dataNumberYArray = ref([]);

const props = defineProps({
  // 数据
  dataX: {
    type: Array<string>,
    default: []
  },
  dataY: {
    type: Array<number>,
    default: []
  }
});

const updateChartOptions = () => {
  setOptions(
    {
      tooltip: {
        trigger: "item"
      },
      xAxis: {
        type: "category",
        data: dataNumberXArray.value
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: dataNumberYArray.value,
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
  resize();
};

watch([() => props.dataX, () => props.dataY], ([newX, newY]) => {
  console.log(newX);
  console.log(newY);
  dataNumberXArray.value = newX;
  dataNumberYArray.value = newY;
  updateChartOptions();
});

// 初始化图表选项
updateChartOptions();
</script>

<template>
  <div ref="lineChartRef" style="width: 100%; height: 30vh" />
</template>
