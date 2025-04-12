import { is } from "bpmn-js/lib/util/ModelUtil";
import {
  getMid,
  asTRBL,
  getOrientation
} from "diagram-js/lib/layout/LayoutUtil";
import {
  findFreePosition,
  generateGetNextPosition,
  getConnectedDistance
} from "diagram-js/lib/features/auto-place/AutoPlaceUtil";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class CustomAutoPlace {
  constructor(config: any, eventBus: any) {
    const { minDistance = 100 } = config || {};

    eventBus.on("autoPlace", 3000, (context: any) => {
      const shape = context.shape,
        source = context.source;

      return getNewShapePosition(source, shape, minDistance);
    });
  }
}

function getVerticalDistance(orientation: string, minDistance: number): number {
  if (orientation.indexOf("top") !== -1) {
    return -1 * minDistance;
  } else if (orientation.indexOf("bottom") !== -1) {
    return minDistance;
  } else {
    return 0;
  }
}

function getNewShapePosition(
  source: any,
  element: any,
  minDistance: number
): any {
  if (is(element, "bpmn:FlowNode")) {
    const sourceTrbl = asTRBL(source);
    const sourceMid = getMid(source);

    const horizontalDistance = getConnectedDistance(source, {
      defaultDistance: minDistance,
      filter: (connection: any) => is(connection, "bpmn:SequenceFlow")
    });

    let margin = 30,
      orientation = "left";

    if (is(source, "bpmn:BoundaryEvent")) {
      orientation = getOrientation(source, source.host, -25);

      if (orientation.indexOf("top") !== -1) {
        margin *= -1;
      }
    }

    const position = {
      x: sourceTrbl.right + horizontalDistance + element.width / 2,
      y: sourceMid.y + getVerticalDistance(orientation, minDistance)
    };

    const nextPositionDirection = {
      y: {
        margin: margin,
        minDistance: minDistance
      }
    };

    const getNextPositionWrapper = (element: any, position: any, connectedAtPosition: any): any => {
      const point = generateGetNextPosition(nextPositionDirection)(element, position, connectedAtPosition);
      return { ...point };
    };

    return findFreePosition(
      source,
      element,
      position,
      getNextPositionWrapper
    );
  }
}

// @ts-ignore
CustomAutoPlace.$inject = ["config.autoPlace", "eventBus"];

export default CustomAutoPlace;
