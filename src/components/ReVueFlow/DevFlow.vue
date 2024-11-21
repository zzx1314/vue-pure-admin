<script setup>
import { nextTick, ref } from "vue";
import { MarkerType, VueFlow } from "@vue-flow/core";
import Collector from "./CollectorNode.vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import Server from "./ServerNode.vue";

const nodes = ref([]);
const edges = ref([]);

nextTick(() => {
  const div = document.querySelector(".vue-flow-container");
  const width = div.offsetWidth;
  const height = div.offsetHeight;
  const minag = Math.round(div.offsetWidth / 2);
  console.log(`宽度: ${width}px, 高度: ${height}px`);
  const data = [
    {
      id: "1",
      type: "collector",
      position: { x: 0, y: 150 },
      data: { label: "Node 1" }
    },
    {
      id: "2",
      type: "server",
      position: { x: 150, y: 0 },
      data: { label: "Node 2" }
    },
    {
      id: "3",
      type: "collector",
      position: { x: 300, y: 150 },
      data: { label: "Node 3" }
    },
    {
      id: "4",
      type: "collector",
      position: { x: 150, y: 150 },
      data: { label: "Node 4" }
    }
  ];
  const dataEdges = [
    {
      id: "e1a-2",
      source: "1",
      target: "2",
      type: "step",
      markerEnd: MarkerType.ArrowClosed
    },
    {
      id: "e1a-3",
      source: "3",
      target: "2",
      type: "step",
      markerEnd: MarkerType.ArrowClosed
    },
    {
      id: "e1a-4",
      source: "4",
      target: "2",
      type: "step",
      markerEnd: MarkerType.ArrowClosed
    }
  ];
  const serverNodeList = data.filter(item => item.type === "server");
  const collectorNodeList = data.filter(item => item.type === "collector");
  // 设置采集器节点
  if (collectorNodeList.length % 2 === 1) {
    // 数组为奇数
    const middleIndex = Math.floor(collectorNodeList.length / 2);
    for (let i = middleIndex - 1; i >= 0; i--) {
      collectorNodeList[i].position = { x: minag - 100, y: 150 };
    }
    collectorNodeList[middleIndex].position = { x: minag, y: 150 };
    for (let i = middleIndex + 1; i < collectorNodeList.length; i++) {
      collectorNodeList[i].position = { x: minag + 100, y: 150 };
    }
  } else {
    // 数组是偶数
    const middleIndex1 = collectorNodeList.length / 2 - 1;
    const middleIndex2 = collectorNodeList.length / 2;
    collectorNodeList[middleIndex1].position = { x: minag - 50, y: 150 };
    collectorNodeList[middleIndex2].position = { x: minag + 50, y: 150 };
    for (let i = middleIndex1 - 1; i >= 0; i--) {
      collectorNodeList[i].position = { x: minag - 100, y: 150 };
    }
    for (let i = middleIndex2 + 1; i < collectorNodeList.length; i++) {
      collectorNodeList[i].position = { x: minag + 100, y: 150 };
    }
  }
  // 设置服务器节点
  serverNodeList.forEach(item => {
    if (item.type === "server") {
      item.position = { x: minag, y: 0 };
    }
  });
  nodes.value = data;
  edges.value = dataEdges;
});
</script>

<template>
  <div class="corner main">
    <span class="bottom-left" />
    <span class="bottom-right" />
    <div class="text-2xl title">【采集器网络拓扑图】</div>
    <div class="vue-flow-container">
      <VueFlow v-model:nodes="nodes" v-model:edges="edges">
        <template #node-collector="props">
          <Collector :data="props.data" />
        </template>
        <template #node-server="props">
          <Server :data="props.data" />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
}

.vue-flow-container {
  display: flex;
  height: 100vh; /* 使容器充满整个视口高度 */
}
</style>
