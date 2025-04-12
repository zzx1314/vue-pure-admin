<template>
  <el-collapse-item name="element-execution-listeners">
    <template #title>
      <collapse-title :title="$t('panel.executionListeners')">
        <lucide-icon name="Radio" />
      </collapse-title>
    </template>
    <template #extra>
      <el-tag type="primary" effect="dark">
        {{ listeners.length }}
      </el-tag>
    </template>
    <div class="element-extension-listeners">
      <el-table
        :data="listeners"
        size="small"
        :height="'20vh'"
        style="width: 100%"
      >
        <el-table-column prop="index" :label="$t('panel.index')" width="60">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="event" label="EventType" />
        <el-table-column prop="type" label="ListenerType" />
        <el-table-column
          :label="$t('panel.operations')"
          width="140"
          align="center"
        >
          <template #default="{ row, $index }">
            <el-button
              size="small"
              type="info"
              @click="openListenerModel($index, row)"
            >
              {{ $t("panel.edit") }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="removeListener($index)"
            >
              {{ $t("panel.remove") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button size="small" type="primary" @click="openListenerModel(-1)">
        <lucide-icon :size="20" name="Plus" />
        <span>{{ $t("panel.addExecutionListener") }}</span>
      </el-button>
    </div>

    <el-dialog
      v-model="modelVisible"
      title="$t('panel.addExecutionListener')"
      width="640px"
      :append-to-body="true"
    >
      <el-form
        ref="formRef"
        :model="newListener"
        :rules="formRules"
        label-width="120px"
        class="need-filled"
      >
        <el-form-item
          :label="$t('panel.executionListenerEventType')"
          prop="event"
        >
          <el-select
            v-model="newListener.event"
            :options="listenerEventTypeOptions"
          />
        </el-form-item>
        <el-form-item :label="$t('panel.executionListenerType')" prop="type">
          <el-select
            v-model="newListener.type"
            :options="listenerTypeOptions"
            @change="updateListenerType"
          />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'class'"
          :label="$t('panel.javaClass')"
          prop="class"
        >
          <el-input v-model="newListener.class" />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'expression'"
          :label="$t('panel.expression')"
          prop="expression"
        >
          <el-input v-model="newListener.expression" />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'delegateExpression'"
          :label="$t('panel.delegateExpression')"
          prop="delegateExpression"
        >
          <el-input v-model="newListener.delegateExpression" />
        </el-form-item>
        <template
          v-if="formItemVisible.listenerType === 'script' && newListener.script"
        >
          <el-form-item
            :label="$t('panel.scriptFormat')"
            prop="script.scriptFormat"
          >
            <el-input v-model="newListener.script.scriptFormat" />
          </el-form-item>
          <el-form-item
            :label="$t('panel.scriptType')"
            prop="script.scriptType"
          >
            <el-select
              v-model="newListener.script.scriptType"
              :options="scriptTypeOptions"
              @change="updateScriptType"
            />
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'inline'"
            :label="$t('panel.scriptBody')"
            prop="script.value"
          >
            <el-input v-model="newListener.script.value" type="textarea" />
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'external'"
            :label="$t('panel.scriptResource')"
            prop="script.resource"
          >
            <el-input v-model="newListener.script.resource" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" @click="saveExecutionListener">
          {{ $t("panel.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElTag
} from "element-plus";
import EventEmitter from "@/components/ReBpmn/utils/EventEmitter";
import modeler from "@/store/modeler";
import {
  getExecutionListeners,
  addExecutionListener,
  updateExecutionListener,
  removeExecutionListener,
  getExecutionListenerTypes,
  getExecutionListenerType
} from "@/components/ReBpmn/bo-utils/executionListenersUtil";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ElementExecutionListeners",
  setup() {
    const { t } = useI18n();
    const modelerStore = modeler();
    const getActive = computed(() => modelerStore.getActive!);
    const listeners = ref([]);
    const modelVisible = ref(false);
    const newListener = ref({
      event: "",
      type: "class",
      class: "",
      expression: "",
      delegateExpression: "",
      script: {
        scriptFormat: "",
        scriptType: "",
        value: "",
        resource: ""
      }
    });
    const formItemVisible = ref({ listenerType: "class", scriptType: "none" });
    const formRef = ref(null);

    const listenerEventTypeOptions = ref([
      { label: "Start", value: "start" },
      { label: "End", value: "end" },
      { label: "Take", value: "take" }
    ]);
    const listenerTypeOptions = ref([
      { label: "Java Class", value: "class" },
      { label: "Expression", value: "expression" },
      { label: "DelegateExpression", value: "delegateExpression" },
      { label: "Script", value: "script" }
    ]);
    const scriptTypeOptions = ref([
      { label: "External Resource", value: "external" },
      { label: "Inline Script", value: "inline" }
    ]);

    const formRules = {
      event: [
        {
          required: true,
          message: t("panel.eventRequired"),
          trigger: ["blur", "change"]
        }
      ],
      type: [
        {
          required: true,
          message: t("panel.typeRequired"),
          trigger: ["blur", "change"]
        }
      ],
      class: [
        {
          required: true,
          message: t("panel.classRequired"),
          trigger: ["blur", "change"]
        }
      ]
    };

    const reloadListeners = () => {
      modelVisible.value = false;
      listeners.value = getExecutionListeners(getActive.value);
    };

    const saveExecutionListener = () => {
      formRef.value?.validate((valid: boolean) => {
        if (valid) {
          addExecutionListener(getActive.value, newListener.value);
          reloadListeners();
        }
      });
    };

    const removeListener = (index: number) => {
      const listener = listeners.value[index];
      removeExecutionListener(getActive.value, listener);
      reloadListeners();
    };

    const openListenerModel = (index: number, row?: any) => {
      if (row) {
        newListener.value = { ...row };
      } else {
        newListener.value = {
          event: "",
          type: "class",
          class: "",
          expression: "",
          delegateExpression: "",
          script: {
            scriptFormat: "",
            scriptType: "",
            value: "",
            resource: ""
          }
        };
      }
      modelVisible.value = true;
    };

    const updateListenerType = (value: string) => {
      formItemVisible.value.listenerType = value;
      newListener.value.type = value;
      if (value === "script") {
        newListener.value.script = {
          ...newListener.value.script,
          scriptFormat: "",
          scriptType: "",
          value: "",
          resource: ""
        };
      }
    };

    const updateScriptType = (value: string) => {
      formItemVisible.value.scriptType = value;
      newListener.value.script.scriptType = value;
    };

    onMounted(() => {
      reloadListeners();
    });

    return {
      modelVisible,
      listeners,
      newListener,
      formRef,
      formItemVisible,
      listenerEventTypeOptions,
      listenerTypeOptions,
      scriptTypeOptions,
      formRules,
      reloadListeners,
      saveExecutionListener,
      removeListener,
      openListenerModel,
      updateListenerType,
      updateScriptType
    };
  }
});
</script>
