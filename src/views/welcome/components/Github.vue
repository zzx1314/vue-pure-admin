<script setup lang="ts">
import { useColumns } from "./columns";
const { columnsA, columnsC } = useColumns();

const list = [
  {
    columns: columnsA,
    column: 3
  },
  {
    columns: columnsC,
    column: 1
  }
];
</script>

<template>
  <PureDescriptions
    v-for="(item, index) in list"
    :key="index"
    :columns="item.columns"
    :column="item.column"
    direction="vertical"
    border
  />
</template>
