<script setup lang="ts">
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  },
  percentage: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(["update:dialogFormVisible"]);

function closeDialog() {
  emit("update:dialogFormVisible", false);
}
</script>

<template>
  <div class="main">
    <el-dialog
      :model-value="dialogFormVisible"
      width="40%"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="percentage"
        status="success"
        striped
        striped-flow
        :duration="70"
        class="mb-4"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog) {
  background: transparent !important; /* 设置背景为透明 */
  box-shadow: none !important; /* 去掉阴影 */
}
</style>
