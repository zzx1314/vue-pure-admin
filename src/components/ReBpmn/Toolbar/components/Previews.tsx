import { defineComponent } from 'vue'

import BpmnModdle from 'bpmn-moddle'
import modeler from '@/store/modeler'
import {  NCode, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import {ElButton, ElPopover} from "element-plus";

const buttonStyle = {
  width: '100%',
  margin: '1px 0',
}

const Previews = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Previews',
  setup() {
    const { t } = useI18n()
    const previewModel = useDialog()
    const modelerStore = modeler()

    const moddle = new BpmnModdle()

    const openXMLPreviewModel = async () => {
      try {
        const modeler = modelerStore.getModeler!

        if (!modeler) {
          return window.__messageBox.warning('模型加载失败，请刷新重试')
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true })

        previewModel.create({
          title: t('toolbar.previewAs'),
          showIcon: false,
          content: () => (
            <div class="preview-model">
              <NCode code={xml!} language="xml" wordWrap={true}></NCode>
            </div>
          )
        })
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

      previewModel.create({
        title: t('toolbar.previewAs'),
        showIcon: false,
        content: () => (
          <div class="preview-model">
            <NCode code={JSON.stringify(jsonStr, null, 2)} language="json" wordWrap={true}></NCode>
          </div>
        )
      })
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
      </div>
    )
  }
})

export default Previews
