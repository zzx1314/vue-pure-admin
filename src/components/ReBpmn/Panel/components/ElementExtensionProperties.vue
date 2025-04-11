<template>
  <el-collapse-item name="element-extension-properties">
    <template #title>
      <collapse-title :title="$t('panel.extensionProperties')">
        <lucide-icon name="FileCog" />
      </collapse-title>
    </template>
    <template #extra>
      <el-tag type="primary" effect="dark">
        {{ extensions.length }}
      </el-tag>
    </template>
    <div class="element-extension-properties">
      <el-table :data="extensions" size="small" :height="'20vh'" style="width: 100%">
        <el-table-column prop="index" label="Index" width="60">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="value" label="Value"></el-table-column>
        <el-table-column prop="operation" :label="$t('panel.operations')" width="80" align="center">
          <template #default="{ $index }">
            <el-button size="small" type="danger" @click="removeProperty($index)">
              {{ $t('panel.remove') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" size="small" @click="openPropertyModel">
        <lucide-icon :size="20" name="Plus" />
        <span>{{ $t('panel.addExtensionProperties') }}</span>
      </el-button>
    </div>

    <el-dialog v-model="modelVisible" :title="$t('panel.addExtensionProperties')" width="640px">
      <el-form ref="formRef" :model="newProperty" :rules="rules" label-width="120px">
        <el-form-item prop="name" :label="$t('panel.propertyName')">
          <el-input v-model="newProperty.name" />
        </el-form-item>
        <el-form-item prop="value" :label="$t('panel.propertyValue')">
          <el-input v-model="newProperty.value" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" @click="addProperty">
          {{ $t('panel.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script lang="ts">
import { defineComponent, h, markRaw, ref, watch } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElTable, ElTableColumn, ElDialog, ElTag } from 'element-plus'
import { mapState } from 'pinia'
import modelerStore from '@/store/modeler'
import { Element } from 'bpmn-js/lib/model/Types'
import {
  addExtensionProperty,
  getExtensionProperties,
  removeExtensionProperty
} from '@/components/ReBpmn/bo-utils/extensionPropertiesUtil'
import EventEmitter from '@/components/ReBpmn/utils/EventEmitter'

export default defineComponent({
  name: 'ElementExtensionProperties',
  data() {
    return {
      extensions: [],
      extensionsRaw: [],
      newProperty: { name: '', value: '' },
      rules: {
        name: [{ required: true, message: '属性名称不能为空', trigger: ['blur', 'change'] }],
        value: [{ required: true, message: '属性值不能为空', trigger: ['blur', 'change'] }]
      },
      modelVisible: false
    }
  },
  computed: {
    ...mapState(modelerStore, ['getActive', 'getActiveId'])
  },
  watch: {
    getActiveId: {
      immediate: true,
      handler() {
        this.reloadExtensionProperties()
      }
    }
  },
  mounted() {
    this.reloadExtensionProperties()
    EventEmitter.on('element-update', this.reloadExtensionProperties)
  },
  methods: {
    async reloadExtensionProperties() {
      this.modelVisible = false
      await this.$nextTick()
      this.newProperty = { name: '', value: '' }
      this.extensionsRaw = markRaw(getExtensionProperties(this.getActive as Element))
      this.extensions = JSON.parse(JSON.stringify(this.extensionsRaw))
    },
    removeProperty(propIndex: number) {
      removeExtensionProperty(this.getActive as Element, this.extensionsRaw[propIndex])
      this.reloadExtensionProperties()
    },
    async addProperty() {
      const formRef = this.$refs.formRef as any
      formRef.validate((valid: boolean) => {
        if (valid) {
          addExtensionProperty(this.getActive as Element, this.newProperty)
          this.reloadExtensionProperties()
        }
      })
    },
    async openPropertyModel() {
      this.modelVisible = true
      await this.$nextTick()
      const formRef = this.$refs.formRef as any
      formRef.resetFields()
    }
  }
})
</script>

<style scoped></style>
