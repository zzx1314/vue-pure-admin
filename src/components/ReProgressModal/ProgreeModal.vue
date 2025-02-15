<script setup lang="ts">
import { watchEffect } from "vue";

defineOptions({
  name: "ProgressModal"
});
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["update:isVisible"]);

// 监听 progress 变化
watchEffect(() => {
  if (props.progress === 100) {
    emit("update:isVisible", false);
  }
});
</script>

<template>
  <div class="my-dialog">
    <el-dialog
      :model-value="isVisible"
      width="30%"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="progress"
        striped
        striped-flow
        class="mb-4"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.my-dialog) {
  background-color: transparent;
}

/* 透明背景的样式 */
:deep(.el-dialog--center) {
  background-color: transparent;
}

:deep(.el-dialog) {
  box-shadow: none !important;
}
</style>
