import { defineComponent, watch } from 'vue'
import { ElButton, ElButtonGroup, ElPopover } from 'element-plus'
import EventEmitter from '@/components/ReBpmn/utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type CommandStack from 'diagram-js/lib/command/CommandStack'
import { createNewDiagram } from '@/components/ReBpmn/utils'
import LucideIcon from '@/components/ReBpmn/common/LucideIcon.vue'
import { useI18n } from 'vue-i18n'

const Commands = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Commands',
  props: {
    isRestart: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { t } = useI18n()
    let command: CommandStack | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      command = modeler.get<CommandStack>('commandStack')
    })

    const undo = () => {
      command && command.canUndo() && command.undo()
    }

    const redo = () => {
      command && command.canRedo() && command.redo()
    }

    const restart = () => {
      command && command.clear()
      createNewDiagram()
    }

    watch(() => props.isRestart, (val) => {
      if (val) {
        restart()
      }
    })

    return () => (
      <ElButtonGroup>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={undo}>
                <LucideIcon name="Undo2" size={16}></LucideIcon>
              </ElButton>
            ),
            default: () => t('toolbar.undo'),
          }}
        ></ElPopover>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={redo}>
                <LucideIcon name="Redo2" size={16}></LucideIcon>
              </ElButton>
            ),
            default: () => t('toolbar.redo'),
          }}
        ></ElPopover>
        <ElPopover
          trigger="hover"
          v-slots={{
            reference: () => (
              <ElButton onClick={restart}>
                <LucideIcon name="Eraser" size={16}></LucideIcon>
              </ElButton>
            ),
            default: () => t('toolbar.restart'),
          }}
        ></ElPopover>
      </ElButtonGroup>
    )
  }
})

export default Commands
