<script setup lang="ts">
import { PropType } from "vue";
import { ListItem } from "../data";
import NoticeItem from "./NoticeItem.vue";
import { transformI18n } from "@/plugins/i18n";

defineProps({
  list: {
    type: Array as PropType<Array<ListItem>>,
    default: () => []
  },
  emptyText: {
    type: String,
    default: ""
  }
});

const emit = defineEmits<{
  (e: "list-change", item: ListItem): void;
}>();

const handleItemClick = (item: ListItem) => {
  console.log("Received item:", item);
  emit("list-change", item);
};
</script>

<template>
  <div v-if="list.length">
    <NoticeItem
      v-for="(item, index) in list"
      :key="index"
      :noticeItem="item"
      @item-clicked="handleItemClick"
    />
  </div>
  <el-empty v-else :description="transformI18n(emptyText)" />
</template>
