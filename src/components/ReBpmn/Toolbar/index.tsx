import { defineComponent } from 'vue'
import { ElButtonGroup } from 'element-plus'
import Imports from '@/components/ReBpmn/Toolbar/components/Imports'
import Exports from '@/components/ReBpmn/Toolbar/components/Exports'
import Previews from '@/components/ReBpmn/Toolbar/components/Previews'
import Aligns from '@/components/ReBpmn/Toolbar/components/Aligns'
import Scales from '@/components/ReBpmn/Toolbar/components/Scales'
import Commands from '@/components/ReBpmn/Toolbar/components/Commands'
import ExternalTools from '@/components/ReBpmn/Toolbar/components/ExternalTools'

const Toolbar = defineComponent({
  name: 'ToolBar',
  props: {
    isRestart: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return () => (
      <div class="toolbar">
        <ElButtonGroup>
          <Imports></Imports>
          <Exports></Exports>
          <Previews></Previews>
        </ElButtonGroup>
        <Scales style={{ marginLeft: '16px' }}></Scales>
        <Commands isRestart={props.isRestart}></Commands>
      </div>
    )
  }
})

export default Toolbar
