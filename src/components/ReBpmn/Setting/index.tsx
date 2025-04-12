import { defineComponent, type PropType, ref, toRaw, watch } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElSwitch,
  ElDialog,
  ElColorPicker,
  ElInputNumber,
  ElCard
} from "element-plus";
import type { EditorSettings } from "types/editor/settings";
import { defaultSettings } from "@/components/ReBpmn/config";
import editor from "@/store/editor";
import LucideIcon from "@/components/ReBpmn/common/LucideIcon.vue";

import { useI18n } from "vue-i18n";

const props = {
  settings: {
    type: Object as PropType<EditorSettings>,
    default: () => defaultSettings
  }
};

const Setting = defineComponent({
  name: "EditorSetting",
  props: props,
  emits: ["update:settings"],
  setup(props) {
    const { t, locale } = useI18n();

    const modelVisible = ref(false);
    const editorStore = editor();

    const themeColorKeys = [
      "defaultFillColor",
      "defaultStartEventColor",
      "defaultEndEventColor",
      "defaultIntermediateEventColor",
      "defaultIntermediateThrowEventColor",
      "defaultIntermediateCatchEventColor",
      "defaultTaskColor",
      "defaultLabelColor",
      "defaultGatewayColor",
      "defaultSequenceColor"
    ];
    const themeOpacityKeys = [
      "defaultStartEventOpacity",
      "defaultEndEventOpacity",
      "defaultIntermediateThrowEventOpacity",
      "defaultIntermediateCatchEventOpacity",
      "defaultTaskOpacity",
      "defaultLabelOpacity",
      "defaultGatewayOpacity",
      "defaultSequenceOpacity"
    ];
    const editorSettings = ref(props.settings);
    const changeModelVisible = event => {
      event.stopPropagation();
      modelVisible.value = !modelVisible.value;
    };

    watch(
      () => editorSettings.value,
      () => {
        if (editorSettings.value.penalMode !== "custom") {
          editorSettings.value.processEngine = "camunda";
        }
        locale.value = editorSettings.value.language;
        editorSettings.value &&
          editorStore.updateConfiguration(toRaw(editorSettings.value));
      },
      { deep: true }
    );

    return () => (
      <div class="setting" onClick={e => e.stopPropagation()}>
        <div class="toggle-button" onClick={changeModelVisible}>
          <LucideIcon name="Settings" size={40} color="#ffffff"></LucideIcon>
        </div>

        <ElDialog
          v-model={modelVisible.value}
          title={t("configForm.preferences")}
          width="50%"
          center
        >
          <ElCard>
            <ElForm label-position="left" label-width="140px" size="small">
              <ElFormItem label={t("configForm.language")}>
                <ElRadioGroup v-model={editorSettings.value.language}>
                  <ElRadio label="zh_CN">简体中文</ElRadio>
                  <ElRadio label="en_US">English</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.processName")}>
                <ElInput
                  v-model={editorSettings.value.processName}
                  clearable={true}
                ></ElInput>
              </ElFormItem>
              <ElFormItem label={t("configForm.processId")}>
                <ElInput
                  v-model={editorSettings.value.processId}
                  clearable={true}
                ></ElInput>
              </ElFormItem>
              <ElFormItem label={t("configForm.toolbar")}>
                <ElSwitch v-model={editorSettings.value.toolbar}></ElSwitch>
              </ElFormItem>
              <ElFormItem label={t("configForm.miniMap")}>
                <ElSwitch v-model={editorSettings.value.miniMap}></ElSwitch>
              </ElFormItem>
              <ElFormItem label={t("configForm.useLint")}>
                <ElSwitch v-model={editorSettings.value.useLint}></ElSwitch>
              </ElFormItem>
              <ElFormItem label={t("configForm.templateChooser")}>
                <ElSwitch
                  v-model={editorSettings.value.templateChooser}
                ></ElSwitch>
              </ElFormItem>
              <ElFormItem
                label={t("configForm.contextmenu")}
                help={t(
                  "configForm.There are different states under TemplateChooser"
                )}
              >
                <ElSwitch v-model={editorSettings.value.contextmenu}></ElSwitch>
              </ElFormItem>
              <ElFormItem label={t("configForm.customContextmenu")}>
                <ElSwitch
                  v-model={editorSettings.value.customContextmenu}
                ></ElSwitch>
              </ElFormItem>
              <ElFormItem label={t("configForm.processEngine")}>
                <ElRadioGroup v-model={editorSettings.value.processEngine}>
                  <ElRadio label="camunda">{t("configForm.camunda")}</ElRadio>
                  <ElRadio label="activiti">{t("configForm.activiti")}</ElRadio>
                  <ElRadio label="flowable">{t("configForm.flowable")}</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.background")}>
                <ElRadioGroup v-model={editorSettings.value.bg}>
                  <ElRadio label="grid-image">
                    {t("configForm.gridImage")}
                  </ElRadio>
                  <ElRadio label="grid">{t("configForm.grid")}</ElRadio>
                  <ElRadio label="image">{t("configForm.image")}</ElRadio>
                  <ElRadio label="none">{t("configForm.none")}</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.penalMode")}>
                <ElRadioGroup v-model={editorSettings.value.penalMode}>
                  <ElRadio label="default">{t("configForm.default")}</ElRadio>
                  <ElRadio label="rewrite" disabled={true}>
                    {t("configForm.rewrite")}
                  </ElRadio>
                  <ElRadio label="custom">{t("configForm.custom")}</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.paletteMode")}>
                <ElRadioGroup v-model={editorSettings.value.paletteMode}>
                  <ElRadio label="default">{t("configForm.default")}</ElRadio>
                  <ElRadio label="rewrite">{t("configForm.rewrite")}</ElRadio>
                  <ElRadio label="enhancement">
                    {t("configForm.enhancement")}
                  </ElRadio>
                  <ElRadio label="custom">{t("configForm.custom")}</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.contextPadMode")}>
                <ElRadioGroup v-model={editorSettings.value.contextPadMode}>
                  <ElRadio label="default">{t("configForm.default")}</ElRadio>
                  <ElRadio label="rewrite">{t("configForm.rewrite")}</ElRadio>
                  <ElRadio label="enhancement">
                    {t("configForm.enhancement")}
                  </ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label={t("configForm.rendererMode")}>
                <ElRadioGroup v-model={editorSettings.value.rendererMode}>
                  <ElRadio label="default">{t("configForm.default")}</ElRadio>
                  <ElRadio label="rewrite">{t("configForm.rewrite")}</ElRadio>
                  <ElRadio label="enhancement">
                    {t("configForm.enhancement")}
                  </ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem
                label={t("configForm.otherModule")}
                help="AutoPlace, Rules ..."
              >
                <ElSwitch v-model={editorSettings.value.otherModule}></ElSwitch>
              </ElFormItem>
              {editorSettings.value.rendererMode === "rewrite" && (
                <ElFormItem
                  label={t("configForm.customTheme")}
                  class="theme-list"
                  label-position="top"
                >
                  {themeColorKeys.map(key => {
                    return (
                      <div class="theme-item">
                        <div class="theme-item_label">{key}：</div>
                        <ElColorPicker
                          v-model={editorSettings.value.customTheme[key]}
                          show-alpha={false}
                        ></ElColorPicker>
                      </div>
                    );
                  })}
                  {themeOpacityKeys.map(key => {
                    return (
                      <div class="theme-item">
                        <div class="theme-item_label">{key}：</div>
                        <ElInputNumber
                          v-model={editorSettings.value.customTheme[key]}
                        ></ElInputNumber>
                      </div>
                    );
                  })}
                </ElFormItem>
              )}
            </ElForm>
          </ElCard>
        </ElDialog>
      </div>
    );
  }
});

export default Setting;
