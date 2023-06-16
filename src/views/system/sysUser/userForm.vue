<script setup lang="ts">
import { useUser } from "./hook";
import { DynamicFormLayOut } from "@/components/ReForm/main";
import { onMounted, ref } from "vue";
import { FormInstance } from "element-plus";
import { IDynamicFormItemSelectValueOption } from "@/components/ReForm/view/MySelect";

const { addFormRef, addFormOptions, onReadyAdd } = useUser();

const props = defineProps({
  roleArry: {
    type: Array as PropType<Array<IDynamicFormItemSelectValueOption>>,
    default: () => []
  },
  addForm: {
    type: Object,
    default: () => null
  }
});

onMounted(() => {
  (addFormRef.value.getFormRef() as FormInstance).resetFields();
});

const newRoleArray = ref(props.roleArry);
const newAddForm = ref(props.addForm);

function getRef() {
  return addFormRef.value.getFormRef() as FormInstance;
}

defineExpose({ getRef });
</script>
<template>
  <div>
    <DynamicFormLayOut
      ref="addFormRef"
      :options="addFormOptions"
      :model="newAddForm"
      @ready="onReadyAdd(newRoleArray)"
    />
  </div>
</template>
