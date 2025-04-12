import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import type { Injector } from "didi";
import type EventBus from "diagram-js/lib/core/EventBus";
import type ContextPad from "diagram-js/lib/features/context-pad/ContextPad";
import type Modeling from "bpmn-js/lib/features/modeling/Modeling.js";
import type ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import type Connect from "diagram-js/lib/features/connect/Connect";
import type Create from "diagram-js/lib/features/create/Create";
import type PopupMenu from "diagram-js/lib/features/popup-menu/PopupMenu";
import type Canvas from "diagram-js/lib/core/Canvas";
import type Rules from "diagram-js/lib/features/rules/Rules";
import type { Element } from "diagram-js/lib/model/Types";

class RewriteContextPadProvider extends ContextPadProvider {
  private _contextPad: ContextPad;
  private _modeling: Modeling;
  private _elementFactory: ElementFactory;
  private _autoPlace: any;
  private _connect: Connect;
  private _create: Create;
  private _popupMenu: PopupMenu;
  private _canvas: Canvas;
  private _rules: Rules;
  constructor(
    config: any,
    injector: Injector,
    eventBus: EventBus,
    contextPad: ContextPad,
    modeling: Modeling,
    elementFactory: ElementFactory,
    connect: Connect,
    create: Create,
    popupMenu: PopupMenu,
    canvas: Canvas,
    rules: Rules,
    translate
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate
    );

    this._contextPad = contextPad;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;

    this._autoPlace = injector.get("autoPlace", false);
  }

  getContextPadEntries(element: Element) {
    const actions: Record<string, any> = {};

    return actions;
  }
}

export default RewriteContextPadProvider;
