<script setup>
import { Handle, Position } from "@vue-flow/core";
import Server from "@/assets/server.png";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div>{{ props.data.label }}</div>
  <img
    :src="Server"
    alt="Node Icon"
    class="node-icon"
    style="width: 50px; height: 50px"
  />

  <Handle id="a" type="target" :position="Position.Bottom" />
</template>
