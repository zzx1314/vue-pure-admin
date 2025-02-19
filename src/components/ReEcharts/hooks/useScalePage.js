import { onMounted, onUnmounted } from "vue";
import _ from "lodash";
export default function useScalePage() {
  const resizeFunc = _.throttle(scalePage, 500);
  onMounted(() => {
    resizeFunc();
    window.addEventListener("resize", resizeFunc);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", resizeFunc);
  });

  function scalePage() {
    // 1.设计稿的尺寸
    let targetX = 1920;
    let targetY = 1080;
    let targetRatio = 16 / 9;

    //2.拿到当前设备(浏览器)的宽度
    let currentX =
      document.documentElement.clientWidth || document.body.clientWidth;
    let currentY =
      document.documentElement.clientHeight || document.body.clientHeight;

    // 3.计算缩放比例
    let scaleRatio = currentX / targetX;
    let currentRatio = currentX / currentY;
    // 超宽屏
    if (currentRatio > targetRatio) {
      scaleRatio = currentY / targetY;
      document.body.style = `width:${targetX}px; height:${targetY}px;transform: scale(${scaleRatio}) translateX(-50%); left: 50%;`;
    } else {
      document.body.style = `width:${targetX}px;height:${targetY}px;transform:scale(${scaleRatio});`;
    }
  }
}
