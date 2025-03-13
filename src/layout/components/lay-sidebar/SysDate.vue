<script setup lang="ts">
import { ref } from "vue";

const nowData = ref("");
setInterval(() => {
  nowData.value = new Date().toLocaleString();
}, 1000);
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
