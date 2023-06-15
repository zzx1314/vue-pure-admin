import { markRaw } from "vue";

import { DynamicFormItemRegistry, IDynamicFormOptions } from "./main";

import { ElInput, ElForm, ElFormItem, ElDatePicker } from "element-plus";
import MySelect from "./view/MySelect.vue";

export const defaultConfig = {
  internalWidgets: {
    Form: {
      component: markRaw(ElForm),
      propsMap: {
        rules: "rules",
        wrapperCol: "wrapper-col-props",
        labelCol: "label-col-props"
      }
    },
    FormItem: {
      component: markRaw(ElFormItem),
      propsMap: {
        name: "prop"
      }
    }
  }
} as IDynamicFormOptions;

export function registerAllFormComponents() {
  // Input组件
  DynamicFormItemRegistry.registerDynamicFormItemControl(
    "text",
    markRaw(ElInput),
    {},
    "modelValue"
  );
  // 时间组件
  DynamicFormItemRegistry.registerDynamicFormItemControl(
    "datePicker",
    markRaw(ElDatePicker),
    {},
    "modelValue"
  );
  // 注册自己的组件
  DynamicFormItemRegistry.registerDynamicFormItemControl(
    "my-select",
    markRaw(MySelect),
    {},
    "value"
  );
}
