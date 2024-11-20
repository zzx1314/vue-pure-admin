<script setup>
import { Handle, Position } from "@vue-flow/core";
import client from "@/assets/client.png";

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
    :src="client"
    alt="Node Icon"
    class="node-icon"
    style="width: 50px; height: 50px"
  />
  <Handle id="a" type="source" :position="Position.Top" />
</template>
