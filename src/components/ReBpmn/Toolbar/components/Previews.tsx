import { defineComponent, ref, onMounted, nextTick } from 'vue'
import BpmnModdle from 'bpmn-moddle'
import modeler from '@/store/modeler'
import { useI18n } from 'vue-i18n'
import { ElButton, ElPopover, ElDialog } from 'element-plus'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 使用 GitHub 风格的代码高亮样式

const buttonStyle = {
  width: '100%',
  margin: '1px 0',
}

const Previews = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Previews',
  setup() {
    const { t } = useI18n()
    const modelerStore = modeler()
    const moddle = new BpmnModdle()

    // Dialog state
    const isDialogVisible = ref(false)
    const dialogTitle = ref('')
    const dialogContent = ref('')
    const dialogLanguage = ref('')

    const openDialog = (title: string, content: string, language: string) => {
      dialogTitle.value = title
      dialogContent.value = content
      dialogLanguage.value = language
      isDialogVisible.value = true

      // 触发语法高亮
      nextTick(() => {
        const codeElement = document.querySelector('pre code')
        if (codeElement) {
          hljs.highlightElement(codeElement as HTMLElement)
        }
      })
    }
    const closeDialog = () => {
      isDialogVisible.value = false
      dialogContent.value = ''
    }
    const openXMLPreviewModel = async () => {
      try {
        const modeler = modelerStore.getModeler!

        if (!modeler) {
          return window.__messageBox.warning('模型加载失败，请刷新重试')
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true })

        openDialog(t('toolbar.previewAs'), xml!, 'xml')
      } catch (e) {
        window.__messageBox.error((e as Error).message || (e as string))
      }
    }

    const openJsonPreviewModel = async () => {
      const modeler = modelerStore.getModeler!

      if (!modeler) {
        return window.__messageBox.warning('模型加载失败，请刷新重试')
      }

      const { xml } = await modeler.saveXML({ format: true })

      const jsonStr = await moddle.fromXML(xml!)

      openDialog(t('toolbar.previewAs'), JSON.stringify(jsonStr, null, 2), 'json')
    }

    return () => (
      <div class="ml-2">
        <ElPopover
          trigger="click"
          v-slots={{
            reference: () => (
              <ElButton type="primary">
                {t('toolbar.previewAs')}
              </ElButton>
            ),
          }}
        >
          <div class="button-list_column">
            <ElButton type="primary" style={buttonStyle} onClick={openXMLPreviewModel}>
              {t('toolbar.previewAsXML')}
            </ElButton>
            <ElButton type="primary" style={buttonStyle} onClick={openJsonPreviewModel}>
              {t('toolbar.previewAsJSON')}
            </ElButton>
          </div>
        </ElPopover>

        <ElDialog
          v-model={isDialogVisible.value}
          title={dialogTitle.value}
          width="50%"
          draggable
          destroyOnClose
          v-slots={{
            footer: () => (
              <div style={{ textAlign: 'right' }}>
                <ElButton onClick={closeDialog}>关闭</ElButton>
              </div>
            ),
          }}
        >
          <pre
            style={{
              background: '#f5f5f5',
              padding: '10px',
              overflow: 'auto',
              borderRadius: '4px',
            }}
          >
            <code class={`language-${dialogLanguage.value}`}>{dialogContent.value}</code>
          </pre>
        </ElDialog>
      </div>
    )
  }
})

export default Previews
