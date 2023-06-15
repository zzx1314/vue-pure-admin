<template>
  <el-col
    v-if="evaluateCallback(item.hidden) !== true"
    class="dynamic-form-item-wrapper"
    :span="item.colProps.span"
    :offset="item.colProps.offset"
  >
    <!--正常条目-->
    <DynamicFormItemNormal
      :item="item"
      :name="name"
      :disabled="disabled || evaluateCallback(item.disabled)"
      :rawModel="rawModel"
      :parentModel="parentModel"
      :model="model"
      @update:model="(v: unknown) => $emit('update:model', v)"
    >
      <template #formCeil="values">
        <slot name="formCeil" v-bind="values" />
      </template>
    </DynamicFormItemNormal>
  </el-col>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, toRefs } from "vue";
import {
  IDynamicFormItem,
  IDynamicFormItemCallback,
  IDynamicFormObject
} from "./DynamicForm";
import DynamicFormItemNormal from "./DynamicFormItemNormal.vue";
import { ColProps } from "./DynamicFormBasicControls/Layout/Col";
import { Rule } from "async-validator";

/**
 * 动态表单条目渲染组件。
 */
export default defineComponent({
  name: "DynamicFormItem",
  props: {
    item: {
      type: Object as PropType<IDynamicFormItem>,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      defalut: false
    },
    model: {
      required: true
    },
    parentModel: {
      required: true
    },
    parentName: {
      type: String,
      default: null
    },
    rawModel: {
      type: Object as PropType<IDynamicFormObject>,
      required: true
    },
    colProps: {
      type: Object as PropType<ColProps>,
      default: () => {
        return { span: 24, offset: 0 };
      }
    }
  },
  emits: ["update:model"],
  setup(props) {
    const propsP = toRefs(props);
    const formRules = inject<Record<string, Rule>>("formRules");

    function evaluateCallback<T>(val: T | IDynamicFormItemCallback<T>) {
      if (
        typeof val === "object" &&
        typeof (val as IDynamicFormItemCallback<T>).callback === "function"
      )
        return (val as IDynamicFormItemCallback<T>).callback(
          propsP.model.value,
          propsP.rawModel.value,
          propsP.parentModel.value,
          propsP.item.value,
          formRules
        );
      return val as T;
    }

    return {
      formRules,
      evaluateCallback
    };
  },
  components: { DynamicFormItemNormal }
});
</script>
