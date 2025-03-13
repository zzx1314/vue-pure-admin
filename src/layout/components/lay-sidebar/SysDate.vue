<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const getWebSocketUrl = () => {
  let protocol = "ws://";
  if (window.location.protocol === "https:") {
    protocol = "wss://";
  }
  return protocol + window.location.host + "/notice";
};

const nowData = ref("");
let webSocket: WebSocket | null = null;

onMounted(() => {
  // 建立 WebSocket 连接
  webSocket = new WebSocket(getWebSocketUrl()); // 替换为你的 WebSocket 服务器地址

  webSocket.onopen = () => {
    console.log("WebSocket connection established");
  };

  webSocket.onmessage = event => {
    // console.log("Message from server:", event.data);
    if (event.data) {
      nowData.value = JSON.parse(event.data).date;
    }
  };

  webSocket.onerror = error => {
    console.error("WebSocket error:", error);
  };

  webSocket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  // 定时任务，每秒更新时间并发送信息
  const intervalId = setInterval(() => {
    // 发送信息到 WebSocket 服务器
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify({ type: "heartbeat" }));
    }
  }, 1000);

  // 清除定时器和 WebSocket 连接
  onUnmounted(() => {
    clearInterval(intervalId);
    if (webSocket) {
      webSocket.close();
    }
  });
});
</script>

<template>
  <div>
    <div class="text-center">
      <div>
        {{ nowData }}
      </div>
    </div>
  </div>
</template>
