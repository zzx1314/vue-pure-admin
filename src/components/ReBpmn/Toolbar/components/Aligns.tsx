import { computed, type ComputedRef, defineComponent } from "vue";
import { ElButton, ElPopover, ElButtonGroup, ElMessage } from "element-plus";
import type Modeler from "bpmn-js/lib/Modeler";
import type Selection from "diagram-js/lib/features/selection/Selection";
import type Modeling from "bpmn-js/lib/features/modeling/Modeling.js";
import EventEmitter from "@/components/ReBpmn/utils/EventEmitter";
import LucideIcon from "@/components/ReBpmn/common/LucideIcon.vue";

import { useI18n } from "vue-i18n";

const Aligns = defineComponent({
  name: "Aligns",
  setup() {
    const { t } = useI18n();

    const buttons: ComputedRef<{ name: string; key: string; icon: string }[]> =
      computed(() => {
        return [
          {
            name: t("toolbar.alignLeft"),
            key: "left",
            icon: "AlignStartVertical"
          },
          {
            name: t("toolbar.alignCenter"),
            key: "center",
            icon: "AlignCenterVertical"
          },
          {
            name: t("toolbar.alignRight"),
            key: "right",
            icon: "AlignEndVertical"
          },
          {
            name: t("toolbar.alignTop"),
            key: "top",
            icon: "AlignStartHorizontal"
          },
          {
            name: t("toolbar.alignMiddle"),
            key: "middle",
            icon: "AlignCenterHorizontal"
          },
          {
            name: t("toolbar.alignBottom"),
            key: "bottom",
            icon: "AlignEndHorizontal"
          }
        ];
      });

    let modeling: Modeling | null = null;
    let selection: Selection | null = null;
    let align: any = null;

    EventEmitter.on("modeler-init", (modeler: Modeler) => {
      modeling = modeler.get("modeling");
      selection = modeler.get("selection");
      align = modeler.get("alignElements");
    });

    const alignElements = (tag: string) => {
      if (modeling && selection) {
        const SelectedElements = selection.get();
        if (!SelectedElements || SelectedElements.length <= 1) {
          return ElMessage.warning("请按住 Shift 键选择多个元素对齐");
        }
        align.trigger(SelectedElements, tag);
      }
    };

    return () => (
      <ElButtonGroup>
        {buttons.value.map(item => {
          return (
            <ElPopover content={item.name} placement="top">
              {{
                default: () => (
                  <ElButton
                    onClick={() => alignElements(item.key)}
                    size="small"
                  >
                    <LucideIcon name={item.icon} size={16}></LucideIcon>
                  </ElButton>
                )
              }}
            </ElPopover>
          );
        })}
      </ElButtonGroup>
    );
  }
});

export default Aligns;
