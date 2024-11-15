<template>
  <div class="water-ball">
    <!-- 波浪icon -->
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      style="display: none"
    >
      <symbol id="wave">
        <path
          d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"
        />
        <path
          d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
        />
        <path
          d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
        />
        <path
          d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"
        />
      </symbol>
    </svg>

    <!-- 水球 -->
    <div class="box" :style="{ width: size, height: size }">
      <div class="percent" :style="{ fontSize: countSize }">
        <div id="count" ref="countRef" class="percentNum">0</div>
        <div class="percentB">%</div>
      </div>
      <!-- 这个元素往上移 -->
      <div id="water" ref="waterRef" class="water">
        <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
          <use xlink:href="#wave" />
        </svg>
        <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
          <use xlink:href="#wave" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "190px"
  },
  // 目标进度
  percentage: {
    type: Number,
    default: 75
  },
  countSize: {
    type: String,
    default: "40px"
  }
});

const countRef = ref(null);
const waterRef = ref(null);

watch(
  () => props.percentage,
  (newV, oldV) => {
    startAnimation(newV);
  }
);

function startAnimation(percentage) {
  let countEl = countRef.value;
  let waterEl = waterRef.value;
  let percent = 0; // 数据初始值 0
  let interval;
  // 1.定时更新数据
  interval = setInterval(function () {
    countEl.innerHTML = percent;
    if (percent <= 100) {
      // 2.超过100不能移动
      waterEl.style.transform = "translate(0" + "," + (100 - percent) + "%)";
    }
    // 3.停止定时
    if (percent >= percentage) {
      countEl.innerHTML = percentage;
      clearInterval(interval);
    }
    percent++;
  }, 45);
}
</script>

<style scoped>

@keyframes wave-front {
  100% {
    transform: translateX(-50%);
  }
}

@keyframes wave-back {
  100% {
    transform: translateX(50%);
  }
}

.water-ball {
  position: relative;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  border-radius: 100%;
  transform: translate(-50%, -50%);
}

.box .percent {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #fff;
}

.box .water {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: #00c6ff;
  transform: translate(0, 100%);
}

/* 波浪定位 */
.box .water_wave {
  position: absolute;
  bottom: 100%;
  width: 200%;
}

/* ============波浪动画============ */
.box .water_wave_back {
  right: 0;
  fill: #c7eeff;
  animation: wave-back 1.4s infinite linear;
}

.box .water_wave_front {
  left: 0;
  margin-bottom: -1px;
  fill: #00c6ff;
  animation: wave-front 0.7s infinite linear;
}

/* ============波浪动画============ */
</style>
