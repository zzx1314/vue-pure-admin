<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  assigningRow: any;
  companyTree: Array<any>;
  selectedCompanyId: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:selectedCompanyId", value: number | null): void;
  (e: "confirm"): void;
}>();

function handleCancel() {
  emit("update:modelValue", false);
}

function handleCompanyChange(value) {
  emit("update:selectedCompanyId", value ?? null);
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="props.assigningRow?.transfer ? '转移归属单位' : '分配归属单位'"
    width="500px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-tree-select
      :model-value="selectedCompanyId"
      :data="companyTree"
      node-key="id"
      check-strictly
      filterable
      clearable
      :props="{
        label: 'name',
        value: 'id',
        children: 'children',
        disabled: 'disabled'
      }"
      placeholder="请选择单位"
      class="w-full"
      @update:model-value="handleCompanyChange"
    />
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="emit('confirm')">确定</el-button>
    </template>
  </el-dialog>
</template>
