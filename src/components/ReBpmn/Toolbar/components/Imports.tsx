import { defineComponent, ref } from 'vue'
import modeler from '@/store/modeler'
import { useI18n } from 'vue-i18n'

const Imports = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Imports',
  setup() {
    const { t } = useI18n()
    const modelerStore = modeler()
    const importRef = ref<HTMLInputElement | null>(null)

    const openImportWindow = () => {
      importRef.value && importRef.value.click()
    }

    const changeImportFile = () => {
      if (importRef.value && importRef.value.files) {
        const file = importRef.value.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          const xmlStr = this.result
          modelerStore.getModeler!.importXML(xmlStr as string)
        }
        importRef.value.value = ''
        importRef.value.files = null
      }
    }

    return () => (
      <span class="ml-2">
        <el-button type="primary" onClick={openImportWindow}>
          {t('toolbar.openFile')}
        </el-button>
        <input
          type="file"
          ref={importRef}
          style="display: none"
          accept=".xml,.bpmn"
          onChange={changeImportFile}
        ></input>
      </span>
    )
  }
})

export default Imports
