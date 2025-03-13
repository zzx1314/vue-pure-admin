import {
  VxeUI,

  // VxeButton,
  // VxeButtonGroup,
  // VxeDrawer,
  // VxeForm,
  // VxeFormGroup,
  // VxeFormItem,
  VxeIcon,
  VxeLoading,
  VxeModal,
  // VxePager,
  // VxePrint,
  VxeTooltip,
  // VxeUpload,
  VxeInput,
  VxeNumberInput,
  VxeSelect
} from "vxe-pc-ui";

import {
  VxeTable,
  VxeColumn,
  VxeColgroup,
  VxeGrid,
  VxeToolbar
} from "vxe-table";

// 导入主题变量，也可以重写主题变量
import "vxe-table/styles/cssvar.scss";
import "vxe-pc-ui/styles/cssvar.scss";
// 导入默认的语言包
import zhCN from "vxe-table/es/locale/lang/zh-CN";
// 导入主题变量，也可以重写主题变量
import "vxe-table/styles/cssvar.scss";
import type { App } from "vue";

// 导入默认的语言
VxeUI.setI18n("zh-CN", zhCN);
VxeUI.setLanguage("zh-CN");

export function useVxeTable(app: App) {
  // app.use(VxeButton)
  // app.use(VxeButtonGroup)
  // app.use(VxeDrawer)
  // app.use(VxeForm)
  // app.use(VxeFormGroup)
  // app.use(VxeFormItem)
  app.use(VxeIcon);
  app.use(VxeLoading);
  app.use(VxeModal);
  // app.use(VxePager)
  // app.use(VxePrint)
  // app.use(VxeUpload);
  app.use(VxeInput);
  app.use(VxeSelect), app.use(VxeNumberInput);
  app.use(VxeTable);
  app.use(VxeColumn);
  app.use(VxeColgroup);
  app.use(VxeGrid);
  app.use(VxeToolbar);
  app.use(VxeTooltip);
}
