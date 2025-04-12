import { Element } from 'bpmn-js/lib/model/Types';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import * as replaceOptions from 'bpmn-js/lib/features/replace/ReplaceOptions';
import { isEventSubProcess, isExpanded } from 'bpmn-js/lib/util/DiUtil';
import { isAppendAction } from '@/components/ReBpmn/utils/BpmnDesignerUtils';

export default function (element?: Element) {
  const differentType = (element: Element) => (entry: any) => {
    // 确保 entry.target 是 Element 类型
    if (!isElement(entry.target)) {
      return false;
    }
    return isDifferentType(element)(entry.target);
  };

  const getCurrentReplaceOptions = (element: Element) => {
    const businessObject = element.businessObject;

    if (is(businessObject, 'bpmn:DataObjectReference')) {
      return replaceOptions.DATA_OBJECT_REFERENCE;
    }

    if (
      is(businessObject, 'bpmn:DataStoreReference') &&
      !is(element.parent, 'bpmn:Collaboration')
    ) {
      return replaceOptions.DATA_STORE_REFERENCE;
    }

    // start events outside sub processes
    if (is(businessObject, 'bpmn:StartEvent') && !is(businessObject.$parent, 'bpmn:SubProcess')) {
      return replaceOptions.START_EVENT.filter(differentType(element));
    }

    // expanded/collapsed pools
    if (is(businessObject, 'bpmn:Participant')) {
      return replaceOptions.PARTICIPANT.filter(
        (entry) => isExpanded(element) !== entry.target.isExpanded
      );
    }

    // start events inside event sub processes
    if (is(businessObject, 'bpmn:StartEvent') && isEventSubProcess(businessObject.$parent)) {
      return replaceOptions.EVENT_SUB_PROCESS_START_EVENT.filter((entry) => {
        const target = entry.target;

        if (!isElement(target)) {
          return false;
        }

        const isInterrupting = target.isInterrupting !== false;
        const isInterruptingEqual = getBusinessObject(element).isInterrupting === isInterrupting;

        return (
          differentType(element)(entry) || (!differentType(element)(entry) && !isInterruptingEqual)
        );
      });
    }

    // start events inside sub processes
    if (
      is(businessObject, 'bpmn:StartEvent') &&
      !isEventSubProcess(businessObject.$parent) &&
      is(businessObject.$parent, 'bpmn:SubProcess')
    ) {
      return replaceOptions.START_EVENT_SUB_PROCESS.filter(differentType(element));
    }

    // end events
    if (is(businessObject, 'bpmn:EndEvent')) {
      return replaceOptions.END_EVENT.filter((entry) => {
        const target = entry.target;

        if (!isElement(target)) {
          return false;
        }

        if (
          target.eventDefinitionType == 'bpmn:CancelEventDefinition' &&
          !is(businessObject.$parent, 'bpmn:Transaction')
        ) {
          return false;
        }
        return differentType(element)(entry);
      });
    }

    // boundary events
    if (is(businessObject, 'bpmn:BoundaryEvent')) {
      return replaceOptions.BOUNDARY_EVENT.filter((entry) => {
        const target = entry.target;

        if (!isElement(target)) {
          return false;
        }

        if (
          target.eventDefinitionType == 'bpmn:CancelEventDefinition' &&
          !is(businessObject.attachedToRef, 'bpmn:Transaction')
        ) {
          return false;
        }

        const cancelActivity = target.cancelActivity !== false;
        const isCancelActivityEqual = businessObject.cancelActivity == cancelActivity;

        return (
          differentType(element)(entry) ||
          (!differentType(element)(entry) && !isCancelActivityEqual)
        );
      });
    }

    // intermediate events
    if (
      is(businessObject, 'bpmn:IntermediateCatchEvent') ||
      is(businessObject, 'bpmn:IntermediateThrowEvent')
    ) {
      return replaceOptions.INTERMEDIATE_EVENT.filter(differentType(element));
    }

    // gateways
    if (is(businessObject, 'bpmn:Gateway')) {
      return replaceOptions.GATEWAY.filter(differentType(element));
    }

    // transactions
    if (is(businessObject, 'bpmn:Transaction')) {
      return replaceOptions.TRANSACTION.filter(differentType(element));
    }

    // expanded event sub processes
    if (isEventSubProcess(businessObject) && isExpanded(element)) {
      return replaceOptions.EVENT_SUB_PROCESS.filter(differentType(element));
    }

    // expanded sub processes
    if (is(businessObject, 'bpmn:SubProcess') && isExpanded(element)) {
      return replaceOptions.SUBPROCESS_EXPANDED.filter(differentType(element));
    }

    // collapsed ad hoc sub processes
    if (is(businessObject, 'bpmn:AdHocSubProcess') && !isExpanded(element)) {
      return replaceOptions.TASK.filter((entry) => {
        const target = entry.target;
        if (!isElement(target)) {
          return false;
        }
        const isTargetSubProcess = target.type === 'bpmn:SubProcess';
        const isTargetExpanded = target.isExpanded === true;
        return isDifferentType(element)(target) && (!isTargetSubProcess || isTargetExpanded);
      });
    }

    // flow nodes
    if (is(businessObject, 'bpmn:FlowNode')) {
      const ops = replaceOptions.TASK.filter(differentType(element));
      if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(element)) {
        return ops.filter((entry) => entry.label !== 'Sub Process (collapsed)');
      }
      return ops;
    }
    return [];
  };

  const getAllReplaceOptions = () => {
    const { START_EVENT, TASK, GATEWAY, BOUNDARY_EVENT } = replaceOptions;
    return [...START_EVENT, ...TASK, ...GATEWAY, ...BOUNDARY_EVENT];
  };

  const removeFunctionLabel = (entry) => typeof entry.label === 'string';

  // 辅助函数：检查是否为 Element 类型
  const isElement = (obj: any): obj is Element => {
    return obj && typeof obj === 'object' && 'businessObject' in obj;
  };

  return !isAppendAction(element)
    ? getCurrentReplaceOptions(element!).filter(removeFunctionLabel)
    : getAllReplaceOptions().filter(removeFunctionLabel);
}
