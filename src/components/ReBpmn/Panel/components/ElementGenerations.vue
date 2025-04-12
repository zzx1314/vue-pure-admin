<template>
  <el-collapse-item name="base-info">
    <template #title>
      <collapse-title :title="$t('panel.general')">
        <lucide-icon name="Info" />
      </collapse-title>
    </template>

    <edit-item :label="$t('panel.id')">
      <el-input v-model="elementId" maxlength="32" @change="updateElementId" />
    </edit-item>

    <edit-item :label="$t('panel.name')">
      <el-input
        v-model="elementName"
        maxlength="20"
        @change="updateElementName"
      />
    </edit-item>

    <template v-if="isProcess">
      <edit-item key="version" :label="$t('panel.version')">
        <el-input
          v-model="elementVersion"
          maxlength="20"
          @change="updateElementVersion"
        />
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <el-switch
          v-model="elementExecutable"
          @change="updateElementExecutable"
        />
      </edit-item>
    </template>
  </el-collapse-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import modelerStore from "@/store/modeler";
import { Element } from "bpmn-js/lib/model/Types";
import {
  getNameValue,
  setNameValue
} from "@/components/ReBpmn/bo-utils/nameUtil";
import { setIdValue } from "@/components/ReBpmn/bo-utils/idUtil";
import {
  getProcessExecutable,
  getProcessVersionTag,
  setProcessExecutable,
  setProcessVersionTag
} from "@/components/ReBpmn/bo-utils/processUtil";
import EventEmitter from "@/components/ReBpmn/utils/EventEmitter";

export default defineComponent({
  name: "ElementGenerations",
  data() {
    return {
      elementId: "",
      elementName: "",
      elementVersion: "",
      elementExecutable: true,
      isProcess: false
    };
  },
  computed: {
    ...mapState(modelerStore, ["getActive", "getActiveId"])
  },
  mounted() {
    this.reloadGenerationData();
    EventEmitter.on("element-update", this.reloadGenerationData);
  },
  methods: {
    reloadGenerationData() {
      this.isProcess =
        !!this.getActive && this.getActive.type === "bpmn:Process";
      this.elementId = this.getActiveId as string;
      this.elementName = getNameValue(this.getActive as Element) || "";
      if (this.isProcess) {
        this.elementExecutable = getProcessExecutable(
          this.getActive as Element
        );
        this.elementVersion =
          getProcessVersionTag(this.getActive as Element) || "";
      }
    },
    updateElementName(value: string) {
      setNameValue(this.getActive as Element, value);
    },
    updateElementId(value: string) {
      setIdValue(this.getActive as Element, value);
    },
    updateElementVersion(value: string) {
      const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/;
      if (reg.test(value)) {
        setProcessVersionTag(this.getActive as Element, value);
      } else {
        window.__messageBox.error("版本号必须符合语义化版本2.0.0 要点");
      }
    },
    updateElementExecutable(value: boolean) {
      setProcessExecutable(this.getActive as Element, value);
    }
  }
});
</script>
