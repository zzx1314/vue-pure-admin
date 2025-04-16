<template>
  <div id="bpmnPreview">
    <div
      v-if="isShowTip"
      :style="{ position: 'absolute', left: x, top: y }"
      class="tipTop"
    >
      <div class="tip">
        <span>id: {{ msg }}</span>
      </div>
      <div class="jou" />
    </div>
    <div id="diagram" ref="diagram" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import bpmnViewer from "bpmn-js/lib/Viewer";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

let viewer = ref(null);
const isShowTip = ref(false);
const x = ref("");
const y = ref("");
const msg = ref("");

const diagram = ref(null);

const props = defineProps({
  bpmnXmlStr: {
    type: String,
    default: ``
  },
  historyNodeIds: {
    type: Array,
    default: () => {
      return [];
    }
  },
  currentNodeIds: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

console.log("xml----", props.bpmnXmlStr);

onMounted(() => {
  viewer.value = new bpmnViewer({
    additionalModules: [
      //添加查看时的移动功能
      MoveCanvasModule, // 移动整个画布
      ZoomScrollModule //
    ],
    container: diagram.value,
    height: 400
  });
  showBpmn();
});

const showBpmn = async () => {
  try {
    await viewer.value.importXML(props.bpmnXmlStr);
    const canvas = viewer.value.get("canvas");
    // 调整位置
    canvas.zoom("fit-viewport");
    const eventBus = viewer.value.get("eventBus");

    eventBus.on("element.click", e => {
      if (e.element.type === "bpmn:UserTask") {
        isShowTip.value = true;
        x.value = e.element.x + "px";
        y.value = e.element.y + "px";
        msg.value = e.element.id;
      } else {
        isShowTip.value = false;
      }
    });
    if (props.historyNodeIds.length > 0) {
      props.historyNodeIds.forEach(item => {
        canvas.addMarker(item, "endhighlight");
      });
    }
    if (props.currentNodeIds.length > 0) {
      props.currentNodeIds.forEach(one => {
        canvas.addMarker(one, "highlight");
      });
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<style lang="scss">
.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: #ffcc33 !important; /* color elements as green */
}

.endhighlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: #00cccc !important; /* color elements as green */
}

.bjs-powered-by {
  display: none !important;
}

.tipTop {
  position: absolute;
  z-index: 10;
  width: 200px;
  height: 100px;
  margin: 0 auto;
  color: black;
  background: #66cccc;
}
.tip {
  margin: 10px;
}
.jou {
  position: absolute;
  bottom: 50px;
  left: -10px;
  width: 0px;
  height: 0px;
  border-top: 6px solid transparent;
  border-left: 6px solid transparent;
  border-right: 6px solid #66cccc;
  border-bottom: 6px solid transparent;
}
</style>
