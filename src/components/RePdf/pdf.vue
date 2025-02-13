<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import VuePdfEmbed from "vue-pdf-embed";

defineOptions({
  name: "Pdf"
});

const { t } = useI18n();
const pdfRef = ref<any>();
const pageCount = ref(1);
const loading = ref(true);
const currentPage = ref(1);
const currentRotation = ref(0);
const showAllPages = ref(false);
const rotations = [0, 90, 180, 270];

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});

const handleDocumentRender = () => {
  loading.value = false;
  pageCount.value = pdfRef.value.doc.numPages;
};

const showAllPagesChange = () => {
  currentPage.value = showAllPages.value ? null : 1;
};

const onPrint = () => {
  pdfRef.value.print();
};
</script>

<template>
  <el-card shadow="never">
    <div
      v-loading="loading"
      class="h-[calc(100vh-295px)]"
      :element-loading-text="t('status.pureLoad')"
    >
      <div class="flex justify-between items-center h-9">
        <div v-if="showAllPages" class="font-medium ml-1.25 text-xl">
          共{{ pageCount }}页
        </div>
        <div v-else>
          <el-pagination
            v-model:current-page="currentPage"
            background
            layout="prev, slot, next"
            :page-size="1"
            :total="pageCount"
          >
            {{ currentPage }} / {{ pageCount }}
          </el-pagination>
        </div>
        <div class="w-[170px] flex-bc">
          <el-checkbox v-model="showAllPages" @change="showAllPagesChange">
            显示所有页面
          </el-checkbox>
          <IconifyIconOnline
            v-tippy="{
              maxWidth: 'none',
              content: `翻转（当前角度${rotations[currentRotation]}度）`
            }"
            icon="ic:baseline-rotate-90-degrees-ccw"
            class="cursor-pointer outline-transparent"
            @click="
              currentRotation === 3
                ? (currentRotation = 0)
                : (currentRotation += 1)
            "
          />
          <IconifyIconOnline
            v-tippy="{
              maxWidth: 'none',
              content: '打印'
            }"
            icon="ri:printer-line"
            class="cursor-pointer outline-transparent"
            @click="onPrint"
          />
        </div>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="h-full container overflow-auto"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="props.pdfUrl"
          @rendered="handleDocumentRender"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>
