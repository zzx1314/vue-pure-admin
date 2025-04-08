<script setup lang="ts">
import Toolbar from '@/components/ReBpmn/Toolbar'
import Palette from '@/components/ReBpmn/Palette'
import Designer from '@/components/ReBpmn/Designer'
import Panel from '@/components/ReBpmn/Panel'
import Setting from '@/components/ReBpmn/Setting'
import ContextMenu from '@/components/ContextMenu/index.vue'
import { EditorSettings } from 'types/editor/settings'
import { defaultSettings } from '@/components/ReBpmn/config'

import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { computed, ref, onMounted } from "vue";
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)

const editorSettings = ref<EditorSettings>({ ...defaultSettings })

const processXml = ref<string | undefined>(undefined)

const customPalette = computed(() => editorSettings.value.paletteMode === 'custom')
const customPenal = computed(() => editorSettings.value.penalMode === 'custom')
const showToolbar = computed(() => editorSettings.value.toolbar)

const computedClasses = computed(() => {
  const baseClass = ['designer-container']
  customPalette.value && baseClass.push('designer-with-palette')
  customPenal.value && baseClass.push('designer-with-penal')
  editorSettings.value.bg === 'grid-image' && baseClass.push('designer-with-bg')
  editorSettings.value.bg === 'image' && baseClass.push('designer-with-image')

  return baseClass.join(' ')
})

onMounted(()=>{
  document.body.addEventListener('contextmenu', function (ev) {
    ev.preventDefault()
  })
})
</script>

<template>
  <NConfigProvider
    abstract
    :componentOptions="{ DynamicInput: { buttonSize: 'small' } }"
    :hljs="hljs"
  >
    <NDialogProvider>
      <div :class="computedClasses" id="designer-container">
        <NMessageProvider>
          <Toolbar v-if="showToolbar" />
          <div class="main-content">
            <Palette v-if="customPalette" />
            <Designer v-model:xml="processXml" />
            <Panel v-if="customPenal" />
            <div v-else class="camunda-penal" id="camunda-penal"></div>
          </div>
          <Setting v-model:settings="editorSettings" />
          <ContextMenu />
        </NMessageProvider>
      </div>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style scoped lang="scss">

</style>
