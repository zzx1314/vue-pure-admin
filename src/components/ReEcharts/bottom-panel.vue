<template>
  <div class="bottom-content">
    <template v-for="item in panelItems" :key="item">
      <div :class="['item', `panel${item.id}`]">
        <div class="pan-left">
          <div class="title">{{ item.title }}</div>
          <!-- 数据动画 -->
          <span :id="`total-num-${item.id}`" class="number">{{
            item.totalNum
          }}</span>
          <span class="unit">{{ item.unit }}</span>
        </div>
        <div class="pan-right">
          <span
            :class="['triangle', item.isUp ? 'up-triangle' : 'down-triangle']"
          />
          <!-- 数据动画 -->
          <span :id="`percentage-num-${item.id}`" class="percentage">{{
            item.percentage
          }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { nextTick, watch } from "vue";

import { CountUp } from "countup.js";
const props = defineProps({
  panelItems: {
    type: Array,
    default: function () {
      return [];
    }
  }
});

watch(
  () => props.panelItems,
  (newV, oldV) => {
    //在下一次dom更新完成之后会回调
    nextTick(() => {
      startAnimation(newV);
    });
  }
);

// 给数字执行滚动的动画
function startAnimation(panelItems = []) {
  // 等 dom更新 完成之后执行
  const option1 = {
    decimalPlaces: 1, // 保留一位小数点
    duration: 2,
    useGrouping: false // 1000 -> 1,000
  };
  const option2 = {
    decimalPlaces: 1, // 保留一位小数点
    duration: 2,
    useGrouping: false, // 1000 -> 1,000
    suffix: "%"
  };
  panelItems.forEach(item => {
    new CountUp(`total-num-${item.id}`, item.totalNum, option1).start();
    new CountUp(`percentage-num-${item.id}`, item.percentage, option2).start();
  });
}
</script>

<style scoped lang="scss">
.bottom-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;

  /* padding-top: 40px; */
}

.bottom-content .item {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px 0 35px;
  margin-top: 60px;

  /* border: 1px solid red; */
}

.bottom-content .pan-left {
  font-size: 16px;
  color: #fff;
  opacity: 0.8;
}

.bottom-content .pan-left .title {
  color: white;
}

.bottom-content .pan-left .number {
  font-size: 36px;
  font-weight: bold;
  line-height: 60px;
  color: #23aeff;
}

.bottom-content .pan-left .unit {
  font-size: 18px;
  color: #23aeff;
}

.bottom-content .pan-right {
  margin-top: 35px;
}

.bottom-content .panel1 .pan-right .up-triangle {
  display: inline-block;
  width: 0;
  height: 0;
  margin-bottom: 4px;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #c70013;
  border-left: 8px solid transparent;
}

.bottom .panel1 .pan-right .percentage {
  color: #c70013;
}

.bottom .panel2 .pan-right .up-triangle {
  display: inline-block;
  width: 0;
  height: 0;
  margin-bottom: 4px;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #c70013;
  border-left: 8px solid transparent;
}

.bottom-content .panel2 .pan-right .percentage {
  color: #c70013;
}

.bottom-content .panel3 .pan-right .down-triangle {
  display: inline-block;
  width: 0;
  height: 0;
  margin-bottom: 1px;
  border-top: 8px solid #37a73f;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
}

.bottom-content .panel3 .pan-right .percentage {
  color: #37a73f;
}
</style>
