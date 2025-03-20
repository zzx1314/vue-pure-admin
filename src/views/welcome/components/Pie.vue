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
    default: () => []
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
        name: "资源信息",
        type: "pie",
        top: "20%",
        radius: "80%",
        center: ["50%", "50%"],
        color: [
          "#e6a23c",
          "#f56c6c",
          "#53a7ff",
          "#ba53ff",
          "#9253FFFF",
          "#BA53FFFF",
          "#53dfff"
        ],
        data: props.resInfo
        // emphasis: {
        //   itemStyle: {
        //     shadowBlur: 10,
        //     shadowOffsetX: 0,
        //     shadowColor: "rgba(0, 0, 0, 0.5)"
        //   }
        // }
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
