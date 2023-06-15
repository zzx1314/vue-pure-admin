<template>
  <el-select
    v-model="selectValue"
    @change="onUpdateValue"
    :disabled="disabled"
    v-bind="customProps"
    clearable
  >
    <el-option
      v-for="it in options"
      :key="it.value"
      :value="it.value"
      :label="it.text"
    >
      {{ it.text }}
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
/**
 * 下拉框表单控件，用于解决 el-select 不能选择对象的问题
 */
import { ref, watch, onMounted } from "vue";
import { IDynamicFormItemSelectValueOption } from "./MySelect";

const props = defineProps({
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 选择值
   */
  value: {},
  /**
   * el-select 其他自定义参数
   */
  customProps: {
    default: null
  }
});

const emits = defineEmits(["update:value"]);

const selectValue = ref<string | null>("");
const options = ref<IDynamicFormItemSelectValueOption[]>([]);

function setSelectValue() {
  selectValue.value =
    options.value.find(k => k.value === props.value)?.text || null;
  if (selectValue.value === null)
    selectValue.value =
      options.value.find(k => typeof k.value === typeof props.value)?.text ||
      null;
}

watch(
  () => props.value,
  () => {
    setSelectValue();
  }
);
onMounted(() => {
  setSelectValue();
});

function onUpdateValue(v: unknown) {
  emits("update:value", v);
}

defineExpose({
  setData(newData: IDynamicFormItemSelectValueOption[]) {
    options.value = newData;
  }
});
</script>
