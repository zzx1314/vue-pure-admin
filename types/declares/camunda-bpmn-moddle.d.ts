// 复制粘贴的行为校验
declare module "camunda-bpmn-moddle/lib/CopyPasteBehavior" {
  import type EventBus from "diagram-js/lib/core/EventBus";
  import type { Element } from "diagram-js/lib/model/Types";

  // 注册一个  moddleCopy.canCopyProperty  监听事件
  export default class CopyPasteBehavior {
    constructor(eventBus: EventBus);

    /**
     * 检查是否不允许复制属性
     * @param property
     * @param parent
     */
    canCopyProperty(property: Object | string, parent: Element): boolean;

    canHostInputOutput(parent: Element): boolean;

    canHostConnector(parent: Element): boolean;

    canHostIn(parent: Element): boolean;
  }
}
//
declare module "camunda-bpmn-moddle/lib/CopyPasteRootElementBehavior" {
  import type Modeler from "bpmn-js/lib/Modeler";
  import type EventBus from "diagram-js/lib/core/EventBus";
  import type { Injector } from "didi";
  import type ModdleCopy from "bpmn-js/lib/features/copy-paste/ModdleCopy";
  import type BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

  /**
   * 添加引用的根元素 (bpmn: Error)，如果它们不存在。复制和粘贴中引用的根元素
   * 内部继承 CommandInterceptor
   * 注册 copyPaste.copyElement, copyPaste.pasteElement 事件
   */
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export default class CopyPasteRootElementBehavior {
    constructor(
      bpmnjs: Modeler,
      eventBus: EventBus,
      injector: Injector,
      moddleCopy: ModdleCopy,
      bpmnFactory: BpmnFactory
    );
  }
}
//
declare module "camunda-bpmn-moddle/lib/RemoveInitiatorBehaviour" {
  import type Modeling from "bpmn-js/lib/features/modeling/Modeling.js";
  import type { Injector } from "didi";

  /**
   * 移除 `camunda:initiator` 将startEvent移动到子进程或在子进程中创建时的属性
   * 继承 CommandInterceptor
   */
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export default class RemoveInitiatorBehaviour {
    constructor(modeling: Modeling, injector: Injector);
  }
}
//
declare module "camunda-bpmn-moddle/lib/RemoveVariableEventBehaviour" {
  import type Modeling from "bpmn-js/lib/features/modeling/Modeling.js";
  import type { Injector } from "didi";
  import type BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
  import type ModdleCopy from "bpmn-js/lib/features/copy-paste/ModdleCopy";
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export default class RemoveVariableEventBehaviour {
    constructor(
      modeling: Modeling,
      injector: Injector,
      bpmnFactory: BpmnFactory,
      moddleCopy: ModdleCopy
    );
  }
}
