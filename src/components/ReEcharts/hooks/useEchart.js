import * as echarts from "echarts";
import { onUnmounted } from "vue";

export default function useEchart(divEl) {
  let echartInstance = echarts.init(divEl, null, { renderer: "svg" });
  onUnmounted(() => {
    echartInstance.dispose();
  });

  function setOption(options) {
    echartInstance.setOption(options);
  }
  function resizeEchart() {
    echartInstance.resize();
  }
  return {
    echartInstance,
    setOption,
    resizeEchart
  };
}
