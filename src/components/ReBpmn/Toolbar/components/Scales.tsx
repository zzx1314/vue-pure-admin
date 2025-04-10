import { defineComponent, ref } from 'vue'
import { ElButton, ElPopover, ElButtonGroup } from 'element-plus'
import LucideIcon from '@/components/ReBpmn/common/LucideIcon.vue'
import EventEmitter from '@/components/ReBpmn/utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type Canvas from 'diagram-js/lib/core/Canvas'
import { useI18n } from 'vue-i18n'

interface CanvasEvent<T> {
  viewbox: T
}

const Scales = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Scales',
  setup() {
    const { t } = useI18n()
    const currentScale = ref(1)
    let canvas: Canvas | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      try {
        canvas = modeler.get<Canvas>('canvas')
        currentScale.value = canvas.zoom()
      } finally {
        modeler.on(
          'canvas.viewbox.changed',
          ({ viewbox }: CanvasEvent<{ scale: number; x: number; y: number }>) => {
            if (viewbox && typeof viewbox.scale === 'number') {
              currentScale.value = viewbox.scale
            }
          }
        )
      }
    })

    const zoomReset = (newScale: number | 'fit-viewport') => {
      canvas && canvas.zoom(newScale, newScale === 'fit-viewport' ? undefined : { x: 0, y: 0 })
    }

    const zoomOut = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    const zoomIn = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    return () => (
      <ElButtonGroup>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={() => zoomOut()}>
                <LucideIcon name="ZoomOut" size={16}></LucideIcon>
              </ElButton>
            ),
            default: () => t('toolbar.zoomOut'),
          }}
        ></ElPopover>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={() => zoomReset('fit-viewport')}>
                <span style="text-align: center; display: inline-block; width: 40px">
                  {Math.floor(currentScale.value * 10) * 10 + '%'}
                </span>
              </ElButton>
            ),
            default: () => t('toolbar.zoomReset'),
          }}
        ></ElPopover>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={() => zoomIn()}>
                <LucideIcon name="ZoomIn" size={16}></LucideIcon>
              </ElButton>
            ),
            default: () => t('toolbar.zoomIn'),
          }}
        ></ElPopover>
      </ElButtonGroup>
    )
  }
})

export default Scales
