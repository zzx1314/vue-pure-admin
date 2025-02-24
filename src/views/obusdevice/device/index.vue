<script setup lang="ts">
import { ref } from "vue";
import { type ElDialog, FormInstance } from "element-plus";
import { useOBusDevice } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { useCollectorBusDevForm } from "./form";
import PureTable from "@pureadmin/table";
import { PlusDialogForm, PlusSearch } from "plus-pro-components";
import More from "@iconify-icons/ep/more-filled";
import Password from "@iconify-icons/ri/lock-password-line";
import Dowload from "@iconify-icons/ri/download-line";
import "@xterm/xterm/css/xterm.css";
import Cpu from "@iconify-icons/bi/cpu";
import Memory from "@iconify-icons/bi/memory";
import GraphicsCard from "@/assets/svg/graphics_card.svg?component";
import Motherboard from "@iconify-icons/bi/motherboard";
import Disk from "@iconify-icons/ph/floppy-disk-back-bold";
import WaterBallV1 from "@/components/ReEcharts/WaterBallV1.vue";
import Gauge from "@/components/ReEcharts/Gauge.vue";
import { MoreFilled } from "@element-plus/icons-vue";
import LineCharts from "@/components/ReEcharts/lineCharts.vue";

defineOptions({
  name: "OBusDevice"
});

const addFormRef = ref<FormInstance>();
const commandFormRef = ref<FormInstance>();
const { columnsForm, columnsQueryForm, columnsFormShellLogin } =
  useCollectorBusDevForm();

const {
  queryForm,
  dataList,
  loading,
  title,
  pagination,
  addForm,
  loginShellForm,
  commandForm,
  rules,
  columns,
  expandRowKeys,
  dialogFormVisible,
  dialogShellVisible,
  dialogShellLoginVisible,
  dialogHardWareVisible,
  dialogSysStatusVisible,
  dialogDeviceOnOrLineVisible,
  dialogCommandVisible,
  hardwareInfo,
  memNumber,
  memColor,
  diskNumber,
  diskColor,
  cpuPercent,
  cpuHistory,
  memHistory,
  diskHistory,
  activities,
  commandOptions,
  logPathOptions,
  rulesCommand,
  onSearch,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSubmitError,
  handleSubmit,
  handleShellSubmit,
  handleShallLogin,
  handleDialogOpened,
  handleDialogClosed,
  handleDialogInfoClose,
  handleDialogHardWareInfo,
  handleDialogSysStem,
  handleExpandChange,
  handleCommandSubmit,
  downCommand,
  cancel,
  openDia
} = useOBusDevice();
</script>
<template>
  <div class="main">
    <el-card>
      <PlusSearch
        v-model="queryForm"
        :columns="columnsQueryForm"
        :show-number="4"
        label-width="80"
        label-position="right"
        @search="onSearch"
        @reset="cancel"
      />
    </el-card>
    <PureTableBar title="设备列表" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, checkList, dynamicColumns }">
        <pure-table
          border
          adaptive
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          @expand-change="handleExpandChange"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #expand="{ row }">
            <div class="flex justify-between">
              <div class="flex-1 px-4 flex flex-col items-center">
                <div class="flex mb-1">
                  <el-button link @click="handleDialogHardWareInfo(row)"
                    ><h3>硬件信息</h3></el-button
                  >
                  <div class="button">
                    <el-button
                      link
                      :icon="MoreFilled"
                      type="primary"
                      @click="handleDialogHardWareInfo(row)"
                    />
                  </div>
                </div>
                <div
                  v-for="hia in row.hardwareInfoJArray"
                  :key="hia.name"
                  class="mb-1"
                >
                  <div class="flex flex-row">
                    <div
                      class="basis-10 mr-1"
                      style="flex-basis: 10%; font-weight: bold"
                    >
                      {{ hia.name + ": " }}
                    </div>
                    <div
                      class="basis-90"
                      style="flex-basis: 90%"
                      v-html="hia.value"
                    />
                  </div>
                </div>
              </div>
              <div class="flex-1 px-4 flex flex-col items-center">
                <h3 class="mb-1">软件信息</h3>
                <div
                  v-for="sia in row.softwareInfoJArray"
                  :key="sia.name"
                  class="mb-1"
                >
                  <div>{{ sia.name }}: {{ sia.version }}</div>
                </div>
              </div>
              <div class="flex-1 px-4 flex flex-col items-center">
                <div class="flex mb-1">
                  <el-button link @click="handleDialogSysStem(row)"
                    ><h3>系统状态</h3></el-button
                  >
                  <div class="button">
                    <el-button
                      link
                      :icon="MoreFilled"
                      type="primary"
                      @click="handleDialogSysStem(row)"
                    />
                  </div>
                </div>
                <div
                  v-for="ssa in row.systemStatusJArray"
                  :key="ssa.name"
                  class="mb-1"
                >
                  <div>{{ ssa.name }}: {{ ssa.value }}</div>
                </div>
              </div>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDia(row, addFormRef)"
            >
              修改
            </el-button>
            <!--            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>-->
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Password)"
                      @click="handleShallLogin(row)"
                    >
                      远程登录
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Dowload)"
                      @click="downCommand(row, commandFormRef)"
                    >
                      下发指令
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #content="{ row }">
            <div class="p-2.5 flex justify-center items-center">
              <div v-if="row.status === '在线'" class="breathing-light" />
              <div
                v-if="row.status === '短路'"
                class="offline-breathing-shotCircuit"
              />
              <div v-else class="offline-breathing-light" />
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <PlusDialogForm
      ref="addFormRef"
      v-model:visible="dialogFormVisible"
      v-model="addForm"
      :dialog="{ title: title }"
      :form="{
        columns: columnsForm,
        rules,
        labelWidth: '110px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleSubmit"
    />

    <PlusDialogForm
      ref="loginShellFormRef"
      v-model:visible="dialogShellLoginVisible"
      v-model="loginShellForm"
      :dialog="{ title: '远程登录', width: '500px' }"
      :form="{
        columns: columnsFormShellLogin,
        rules,
        labelWidth: '80px'
      }"
      @cancel="cancel"
      @confirm-error="handleSubmitError"
      @confirm="handleShellSubmit"
    />

    <el-dialog
      v-model="dialogShellVisible"
      title="远程登录"
      class="shellDialog"
      fullscreen
      @open="handleDialogOpened"
      @close="handleDialogClosed"
    >
      <div id="terminal" class="indexContainer" />
    </el-dialog>

    <el-dialog
      v-model="dialogHardWareVisible"
      title="硬件信息"
      class="shellDialog"
      width="80%"
      @close="handleDialogInfoClose"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card
            style="max-width: 300px; height: 250px; margin-bottom: 10px"
            shadow="always"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Cpu" style="font-size: 30px" />
                <div style="font-weight: bold">CPU信息</div>
              </div>
            </template>
            <div
              v-for="cpuInfo in hardwareInfo.cpu"
              :key="cpuInfo.name"
              class="mb-1"
            >
              <div class="flex">
                <div style="margin-right: 5px; font-weight: bold">
                  {{ cpuInfo.name }}:
                </div>
                <div>
                  {{ cpuInfo.value }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="max-width: 300px; height: 250px" shadow="always">
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Memory" style="font-size: 30px" />
                <div style="font-weight: bold">内存信息</div>
              </div>
            </template>
            <div
              v-for="memoryInfo in hardwareInfo.memory"
              :key="memoryInfo.name"
              class="mb-1"
            >
              <div class="flex">
                <div style="margin-right: 5px; font-weight: bold">
                  {{ memoryInfo.name }}:
                </div>
                <div>
                  {{ memoryInfo.value }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="max-width: 300px; height: 250px" shadow="always">
            <template #header>
              <div class="card-header flex items-center gap-2">
                <GraphicsCard />
                <div style="font-weight: bold">显卡</div>
              </div>
            </template>
            <div
              v-for="graphicsCard in hardwareInfo.graphicsCard"
              :key="graphicsCard.name"
              class="mb-1"
            >
              <div class="flex">
                <div style="margin-right: 5px; font-weight: bold">
                  {{ graphicsCard.name }}:
                </div>
                <div>
                  {{ graphicsCard.value }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="max-width: 300px; height: 250px" shadow="always">
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline
                  :icon="Motherboard"
                  style="font-size: 30px"
                />
                <div style="font-weight: bold">主板信息</div>
              </div>
            </template>
            <div
              v-for="motherBoardInfo in hardwareInfo.board"
              :key="motherBoardInfo.name"
              class="mb-1"
            >
              <div class="flex">
                <div style="margin-right: 5px; font-weight: bold">
                  {{ motherBoardInfo.name }}:
                </div>
                <div>
                  {{ motherBoardInfo.value }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="max-width: 300px; height: 250px" shadow="always">
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Disk" style="font-size: 30px" />
                <div style="font-weight: bold">硬盘信息</div>
              </div>
            </template>
            <div
              v-for="diskInfo in hardwareInfo.disk"
              :key="diskInfo.name"
              class="mb-1"
            >
              <div class="flex">
                <div style="margin-right: 5px; font-weight: bold">
                  {{ diskInfo.name }}:
                </div>
                <div>
                  {{ diskInfo.value }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" />
      </el-row>
    </el-dialog>

    <el-dialog
      v-model="dialogSysStatusVisible"
      title="系统状态"
      width="80%"
      @close="handleDialogInfoClose"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Memory" style="font-size: 30px" />
                <div style="font-weight: bold">内存使用率</div>
              </div>
            </template>
            <div>
              <water-ball-v1 :percentage="memNumber" :color="memColor" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Cpu" style="font-size: 30px" />
                <div style="font-weight: bold">CPU使用率</div>
              </div>
            </template>
            <div>
              <Gauge :percentage="cpuPercent" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Disk" style="font-size: 30px" />
                <div style="font-weight: bold">磁盘使用率</div>
              </div>
            </template>
            <div>
              <water-ball-v1
                :percentage="diskNumber"
                :color="diskColor"
                shape="rect"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Memory" style="font-size: 30px" />
                <div style="font-weight: bold">历史内存使用率</div>
              </div>
            </template>
            <div>
              <line-charts :data-x="memHistory.x" :data-y="memHistory.y" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Cpu" style="font-size: 30px" />
                <div style="font-weight: bold">历史CPU使用率</div>
              </div>
            </template>
            <div>
              <line-charts :data-x="cpuHistory.x" :data-y="cpuHistory.y" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            style="max-width: 300px; height: 300px"
            shadow="always"
            class="customizeCardBody"
          >
            <template #header>
              <div class="card-header flex items-center gap-2">
                <IconifyIconOffline :icon="Disk" style="font-size: 30px" />
                <div style="font-weight: bold">历史磁盘使用率</div>
              </div>
            </template>
            <div>
              <line-charts :data-x="diskHistory.x" :data-y="diskHistory.y" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      v-model="dialogDeviceOnOrLineVisible"
      title=""
      width="500px"
      @close="handleDialogInfoClose"
    >
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <h3>设备运行状态</h3>
          </div>
        </template>
        <div class="flex justify-center">
          <el-scrollbar max-height="504" class="mt-3">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :timestamp="activity.timestamp"
                placement="bottom"
              >
                <div class="message">
                  {{ activity.content }}
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </div>
      </el-card>
    </el-dialog>

    <el-dialog
      v-model="dialogCommandVisible"
      title="指令下发"
      width="500px"
      @close="handleDialogInfoClose"
    >
      <el-form
        ref="commandFormRef"
        :model="commandForm"
        :inline="true"
        :rules="rulesCommand"
        label-width="100px"
      >
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="commandForm.type"
            placeholder="请选择类型"
            class="!w-[200px]"
          >
            <el-option
              v-for="item in commandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="commandForm.type === '日志'"
          label="日志路径"
          prop="logPath"
        >
          <el-select
            v-model="commandForm.logPath"
            placeholder="请选择类型"
            class="!w-[200px]"
          >
            <el-option
              v-for="item in logPathOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="commandForm.logPath === 'customize'"
          label="自定义"
          prop="content"
        >
          <el-input
            v-model="commandForm.content"
            placeholder="请输入正确路径"
          />
        </el-form-item>

        <el-form-item
          v-if="commandForm.type === '自定义指令'"
          label="内容"
          prop="content"
        >
          <el-input
            v-model="commandForm.content"
            placeholder="请输入指令内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogInfoClose">取消</el-button>
          <el-button type="primary" @click="handleCommandSubmit(commandFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.customizeCardBody .el-card__body) {
  padding-top: 0 !important;
}

:deep(.el-timeline-item__node--normal) {
  width: 18px;
  height: 18px;
}

:deep(.el-timeline-item__wrapper) {
  top: 3px;
}

:deep(.el-row) {
  margin-bottom: 20px;
}

:deep(.el-row:last-child) {
  margin-bottom: 0;
}

.breathing-light {
  width: 10px;
  height: 10px;
  background: #67c23a;
  border-radius: 100%;
  animation: 2s shadow-breath ease-out infinite normal;
}

.offline-breathing-light {
  width: 10px;
  height: 10px;
  background: #f56c6c;
  border-radius: 100%;
  animation: 2s offline-shadow-breath ease-out infinite normal;
}

.offline-breathing-shotCircuit {
  width: 10px;
  height: 10px;
  background: #e6a23c;
  border-radius: 100%;
  animation: 2s offline-shadow-breath ease-out infinite normal;
}

@keyframes shadow-breath {
  0%,
  100% {
    box-shadow: 0 0 4px 1px #67c23a;
    transform: scale(0.8);
  }

  50% {
    box-shadow: 0 0 30px 3px #67c23a;
    transform: scale(1.5);
  }
}

@keyframes offline-shadow-breath {
  0%,
  100% {
    box-shadow: 0 0 4px 1px #f56c6c;
    transform: scale(0.8);
  }

  50% {
    box-shadow: 0 0 30px 3px #f56c6c;
    transform: scale(1.5);
  }
}

:deep(.el-link) {
  padding-left: 10px;
}

.message {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  padding: 5px 12px;
  line-height: 18px;
  color: #fff;
  word-break: break-all;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  border-radius: 6px;
}

.message::after {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  content: "";
  border-color: var(--el-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}
</style>
