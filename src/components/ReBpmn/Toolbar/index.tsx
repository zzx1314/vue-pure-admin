import { defineComponent } from 'vue'
import { NButtonGroup } from 'naive-ui'
import Imports from '@/components/ReBpmn/Toolbar/components/Imports'
import Exports from '@/components/ReBpmn/Toolbar/components/Exports'
import Previews from '@/components/ReBpmn/Toolbar/components/Previews'
import Aligns from '@/components/ReBpmn/Toolbar/components/Aligns'
import Scales from '@/components/ReBpmn/Toolbar/components/Scales'
import Commands from '@/components/ReBpmn/Toolbar/components/Commands'
import ExternalTools from '@/components/ReBpmn/Toolbar/components/ExternalTools'

const Toolbar = defineComponent({
  name: 'ToolBar',
  setup() {
    return () => (
      <div class="toolbar">
        <NButtonGroup>
          <Imports></Imports>
          <Exports></Exports>
          <Previews></Previews>
        </NButtonGroup>
        <Aligns></Aligns>
        <Scales></Scales>
        <Commands></Commands>
        <ExternalTools></ExternalTools>
      </div>
    )
  }
})

export default Toolbar
