import { defineComponent } from "vue";
import modelerStore from "@/store/modeler";
import type ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import type Create from "diagram-js/lib/features/create/Create";
import { ElCollapse, ElCollapseItem } from "element-plus";

const Palette = defineComponent({
  name: "BpmnPalette",
  setup() {
    const store = modelerStore();
    const createElement = (ev: Event, type: string, options?: any) => {
      const ElementFactory: ElementFactory =
        store.getModeler!.get("elementFactory");
      const create: Create = store.getModeler!.get("create");
      const shape = ElementFactory.createShape({
        type: `bpmn:${type}`,
        ...(options || {})
      });
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }
      create.start(ev, shape, {});
    };

    return () => (
      <div class="palette">
        <ElCollapse>
          <ElCollapseItem title="工具" name="tools">
            工具部分
          </ElCollapseItem>
          <ElCollapseItem title="事件" name="events">
            <div class="palette-el-list">
              <div
                class="palette-el-item start-event"
                onClick={e => createElement(e, "StartEvent")}
              >
                <i class="bpmn-icon-start-event-none"></i>
                <span>开始</span>
              </div>
            </div>
          </ElCollapseItem>
          <ElCollapseItem title="任务" name="tasks">
            任务部分
          </ElCollapseItem>
          <ElCollapseItem title="网关" name="gateways">
            网关部分
          </ElCollapseItem>
        </ElCollapse>
      </div>
    );
  }
});

export default Palette;
