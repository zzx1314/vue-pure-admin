<script setup lang="ts">
import Toolbar from "@/components/ReBpmn/Toolbar";
import Palette from "@/components/ReBpmn/Palette";
import Designer from "@/components/ReBpmn/Designer";
import Panel from "@/components/ReBpmn/Panel";
import ContextMenu from "@/components/ReBpmn/ContextMenu/index.vue";
import { EditorSettings } from "types/editor/settings";
import { defaultSettings } from "@/components/ReBpmn/config";
import "@/components/ReBpmn/styles/index.scss";

import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import { computed, ref, onMounted, type PropType, watch } from "vue";
import { getRoleSelectList } from "@/api/system";
import { SUCCESS } from "@/api/base";
import EventEmitter from "@/components/ReBpmn/utils/EventEmitter";
import {
  actThProcessConfDeployment,
  actThProcessConfGetProcess
} from "@/api/actThProcessConf";
import { message } from "@/utils/message";
import modeler from "@/store/modeler";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

const editorSettings = ref<EditorSettings>({ ...defaultSettings });

const processXml = ref<string | undefined>(undefined);

const customPalette = computed(
  () => editorSettings.value.paletteMode === "custom"
);
const customPenal = computed(() => editorSettings.value.penalMode === "custom");
const showToolbar = computed(() => editorSettings.value.toolbar);

const roleList = ref<any>([]);
const modelerStore = modeler();

const computedClasses = computed(() => {
  const baseClass = ["designer-container"];
  customPalette.value && baseClass.push("designer-with-palette");
  customPenal.value && baseClass.push("designer-with-penal");
  editorSettings.value.bg === "grid-image" &&
    baseClass.push("designer-with-bg");
  editorSettings.value.bg === "image" && baseClass.push("designer-with-image");

  return baseClass.join(" ");
});

const restart = ref(false);

const props = defineProps({
  dialogDesignVisible: {
    type: Boolean,
    default: false
  },
  configInfo: {
    type: Object as PropType<any>,
    default: () => {
      return {};
    }
  },
  processId: {
    type: Object as PropType<any>,
    default: () => {
      return {};
    }
  },
  isShowDeploy: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(["update:dialogDesignVisible"]);

function getRoleList() {
  getRoleSelectList().then(res => {
    if (res.code === SUCCESS) {
      roleList.value = res.data;
    }
  });
}

function getXml() {
  if (props.processId) {
    actThProcessConfGetProcess(props.processId).then(res => {
      if (res.code === SUCCESS) {
        modelerStore.getModeler!.importXML(res.data.xmlString);
      }
    });
  } else if (props.configInfo && props.configInfo.processId) {
    actThProcessConfGetProcess(props.configInfo.processId).then(res => {
      if (res.code === SUCCESS) {
        modelerStore.getModeler!.importXML(res.data.xmlString);
      }
    });
  }
}

EventEmitter.on("save-event", (xml: string) => {
  console.log("save-event-XML:", xml);
  let param = {
    bpmnXml: xml,
    businessType: props.configInfo.businessType,
    configId: props.configInfo.id
  };
  console.log(param);
  actThProcessConfDeployment(param).then(res => {
    if (res.code === SUCCESS) {
      message("部署成功！", { type: "success" });
      cancel();
    } else {
      message(res.msg, { type: "error" });
    }
  });
});

watch(
  () => props.dialogDesignVisible,
  val => {
    restart.value = val;
    getRoleList();
    getXml();
  }
);

function cancel() {
  emit("update:dialogDesignVisible", false);
}

onMounted(() => {
  document.body.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
  });
});
</script>

<template>
  <div class="main">
    <el-dialog
      :model-value="dialogDesignVisible"
      fullscreen
      width="100%"
      append-to-body
      @close="cancel"
    >
      <div id="designer-container" :class="computedClasses">
        <Toolbar
          v-if="showToolbar"
          :is-restart="restart"
          :is-show-deploy="isShowDeploy"
        />
        <div class="main-content">
          <Palette v-if="customPalette" />
          <Designer v-model:xml="processXml" />
          <Panel v-if="customPenal" :roleList="roleList" />
          <div v-else id="camunda-penal" class="camunda-penal" />
        </div>
        <ContextMenu />
      </div>
    </el-dialog>
  </div>
</template>
