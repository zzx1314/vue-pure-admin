<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const gaugeRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(gaugeRef as Ref<HTMLDivElement>, {
  theme
});

const percentageNum = ref(0);

const props = defineProps({
  // 目标进度
  percentage: {
    type: Number,
    default: 75
  }
});

const updateChartOptions = () => {
  setOptions(
    {
      tooltip: {
        trigger: "item"
      },
      legend: {
        icon: "circle",
        //@ts-expect-error
        right: true
      },
      series: [
        {
          type: "gauge",
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.3, "#67e0e3"],
                [0.7, "#37a2da"],
                [1, "#fd666d"]
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: "auto"
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: "#fff",
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: "#fff",
              width: 4
            }
          },
          axisLabel: {
            color: "inherit",
            distance: 20,
            fontSize: 12
          },
          detail: {
            valueAnimation: true,
            formatter: "{value}%",
            color: "inherit",
            fontSize: 20
          },
          data: [
            {
              value: percentageNum.value
            }
          ]
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

watch([() => props.percentage], ([newV]) => {
  percentageNum.value = newV;
  updateChartOptions();
});

// 初始化图表选项
updateChartOptions();
</script>

<template>
  <div ref="gaugeRef" style="width: 100%; height: 24vh" />
</template>
