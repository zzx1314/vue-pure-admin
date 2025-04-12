import { computed, defineComponent, ref } from "vue";
import {
  ElButton,
  ElButtonGroup,
  ElPopover,
  ElInput,
  ElDialog
} from "element-plus";
import LucideIcon from "@/components/ReBpmn/common/LucideIcon.vue";
import editor from "@/store/editor";
import modeler from "@/store/modeler";
import type ToggleMode from "bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode";
import type EventBus from "diagram-js/lib/core/EventBus";
import { useI18n } from "vue-i18n";

const ExternalTools = defineComponent({
  name: "ExternalTools",
  setup() {
    const { t } = useI18n();
    const moduleStore = modeler();

    let minimap: any | null = null;
    const minimapStatus = computed(() => editor().getEditorConfig.miniMap);
    const minimapToggle = () => {
      !minimap && (minimap = moduleStore.getModeler!.get("minimap"));
      minimap && minimap.toggle();
    };

    const mockSimulation = () => {
      moduleStore.getModeler!.get<ToggleMode>("toggleMode").toggleMode();
    };

    let lintModule: any | null = null;
    const lintEnable = computed(() => editor().getEditorConfig.useLint);
    const lintToggle = () => {
      !lintModule && (lintModule = moduleStore.getModeler!.get("linting"));
      lintModule && lintModule.toggle();
    };

    const shortcutKeysDialogVisible = ref(false);
    const shortcutKeysEnable = computed(
      () => editor().getEditorConfig.otherModule
    );
    const templateExternal = computed(
      () => editor().getEditorConfig.templateChooser
    );

    const renderShortcutKeysDialog = () => (
      <div class="shortcut-keys-model">
        <p>Undo</p>
        <p>Ctrl + Z</p>
        <p>Redo</p>
        <p>Ctrl + Shift + Z / ctrl + Y</p>
        <p>Select All</p>
        <p>Ctrl + A</p>
        <p>Zoom</p>
        <p>Ctrl + Mouse Wheel</p>
        <p>Scrolling (Vertical)</p>
        <p>Mouse Wheel</p>
        <p>Scrolling (Horizontal)</p>
        <p>Shift + Mouse Wheel</p>
        <p>Direct Editing</p>
        <p>E</p>
        <p>Hand Tool</p>
        <p>H</p>
        <p>Lasso Tool</p>
        <p>L</p>
        <p>Space Tool</p>
        <p>S</p>
        {templateExternal.value && (
          <>
            <p>Replace Tool</p>
            <p>R</p>
            <p>Append anything</p>
            <p>A</p>
            <p>Create anything</p>
            <p>N</p>
          </>
        )}
      </div>
    );

    const eventsDialogVisible = ref(false);
    const listeners = ref<string[]>([]);
    const listenerFilter = ref<string>("");
    const visibleListeners = computed(() =>
      listeners.value.filter(i => i.includes(listenerFilter.value))
    );

    const openEventsDialog = () => {
      const eventBus = moduleStore.getModeler!.get<EventBus>("eventBus");
      listenerFilter.value = "";
      // listeners.value = Object.keys(eventBus._listeners).sort()
      eventsDialogVisible.value = true;
    };

    return () => (
      <>
        <ElButtonGroup>
          <ElPopover content={t("toolbar.toggleProcessMock")} placement="top">
            <ElButton onClick={mockSimulation}>
              <LucideIcon name="Bot" size={16}></LucideIcon>
            </ElButton>
          </ElPopover>
          <ElPopover content={t("toolbar.bpmnEvents")} placement="top">
            <ElButton onClick={openEventsDialog}>
              <LucideIcon name="Podcast" size={16}></LucideIcon>
            </ElButton>
          </ElPopover>
          {minimapStatus.value && (
            <ElPopover content={t("toolbar.toggleMinimap")} placement="top">
              <ElButton onClick={() => minimapToggle()}>
                <LucideIcon name="Map" size={16}></LucideIcon>
              </ElButton>
            </ElPopover>
          )}
          {lintEnable.value && (
            <ElPopover content={t("toolbar.toggleProcessLint")} placement="top">
              <ElButton onClick={() => lintToggle()}>
                <LucideIcon name="FileCheck" size={16}></LucideIcon>
              </ElButton>
            </ElPopover>
          )}
          {shortcutKeysEnable.value && (
            <ElPopover content={t("toolbar.bpmnShortcutKeys")} placement="top">
              <ElButton
                onClick={() => (shortcutKeysDialogVisible.value = true)}
              >
                <LucideIcon name="Keyboard" size={16}></LucideIcon>
              </ElButton>
            </ElPopover>
          )}
        </ElButtonGroup>

        <ElDialog
          v-model={shortcutKeysDialogVisible.value}
          title={t("toolbar.bpmnShortcutKeys")}
          width="500px"
        >
          {renderShortcutKeysDialog()}
        </ElDialog>

        <ElDialog
          v-model={eventsDialogVisible.value}
          title={t("toolbar.bpmnEvents")}
          width="500px"
        >
          <div class="event-listeners-box">
            <div class="listener-search">
              <ElInput
                v-model={listenerFilter.value}
                placeholder="Search"
                clearable
              ></ElInput>
            </div>
            <div class="event-listeners-box">
              {visibleListeners.value &&
                visibleListeners.value.map((name, key) => {
                  return (
                    <p class="listener-item">
                      {key + 1}：{name}
                    </p>
                  );
                })}
            </div>
          </div>
        </ElDialog>
      </>
    );
  }
});

export default ExternalTools;
