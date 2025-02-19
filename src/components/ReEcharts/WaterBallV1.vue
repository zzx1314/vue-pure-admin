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

const waterBallRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(waterBallRef as Ref<HTMLDivElement>, {
  theme
});

const percentageNum = ref(0);
const colorValue = ref<string>("#FFA661");

const props = defineProps({
  // 目标进度
  percentage: {
    type: Number,
    default: 75
  },
  color: {
    type: String,
    default: "#FFA661"
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
          type: "liquidFill",
          data: [percentageNum.value / 100],
          color: [colorValue.value],
          label: {
            normal: {
              color: "#000000", //百分比颜色
              textStyle: {
                fontSize: 20,
                fontWeight: "bold"
              }
            }
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 5,
              borderColor: props.color,
              shadowBlur: 20,
              shadowColor: "rgba(255, 0, 0, 1)"
            }
          },
          backgroundStyle: {
            //水球背景色
            color: "rgba(255, 255, 255)"
          }
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

watch([() => props.percentage, () => props.color], ([newV, newColor]) => {
  percentageNum.value = newV;
  colorValue.value = newColor;
  updateChartOptions();
});

// 初始化图表选项
updateChartOptions();
</script>

<template>
  <div ref="waterBallRef" style="width: 100%; height: 24vh" />
</template>
