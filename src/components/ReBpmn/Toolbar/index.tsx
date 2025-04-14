import { defineComponent } from "vue";
import { ElButtonGroup, ElButton } from "element-plus";
import Exports from "@/components/ReBpmn/Toolbar/components/Exports";
import Previews from "@/components/ReBpmn/Toolbar/components/Previews";
import Scales from "@/components/ReBpmn/Toolbar/components/Scales";
import Commands from "@/components/ReBpmn/Toolbar/components/Commands";
import modeler from "@/store/modeler";
import EventEmitter from "@/components/ReBpmn/utils/EventEmitter";

const Toolbar = defineComponent({
  name: "ToolBar",
  props: {
    isRestart: {
      type: Boolean,
      default: false
    },
    isShowDeploy: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const modelerStore = modeler();
    // 定义保存函数
    const saveBpmnxml = async () => {
      console.log("Save function triggered!");
      const modeler = modelerStore.getModeler;
      const { error, xml } = await modeler!.saveXML({});
      if (error) {
        console.error("Error saving XML:", error);
        return;
      }
      EventEmitter.emit("save-event", xml); // 发布事件
    };

    return () => (
      <div class="toolbar">
        <ElButtonGroup>
          <span>
            {props.isShowDeploy && (
              <ElButton
                type="primary"
                onClick={saveBpmnxml}
                style={{ marginRight: "8px" }}
              >
                部署
              </ElButton>
            )}
          </span>
          <Exports></Exports>
          <Previews></Previews>
        </ElButtonGroup>
        <Scales style={{ marginLeft: "16px" }}></Scales>
        <Commands isRestart={props.isRestart}></Commands>
      </div>
    );
  }
});

export default Toolbar;
