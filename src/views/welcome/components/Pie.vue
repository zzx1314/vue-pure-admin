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

const pieChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(pieChartRef as Ref<HTMLDivElement>, {
  theme
});

const props = defineProps({
  resInfo: {
    type: Array<any>,
    default: () => [
      { value: 400, name: "驱动" },
      { value: 1600, name: "固件" },
      { value: 7200, name: "设备树" },
      { value: 7200, name: "文件系统" },
      { value: 200, name: "镜像" }
    ]
  }
});

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
        data: [0.6],
        color: ["#FFA661"],
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
            borderColor: "#FFA661",
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

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="pieChartRef" style="width: 100%; height: 35vh" />
</template>
