<script setup lang="ts">
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { reactive, ref } from "vue";
import { sysAuth } from "./hook";

const {
  roleData,
  defaultProps,
  value,
  options,
  sysMenuTitleVoData,
  activeNames,
  currentRoleCode,
  handleCheckAllChange,
  setCheck,
  getAuthAll
} = sysAuth();

defineOptions({
  name: "SplitPane"
});

const settingLR: ContextProps = reactive({
  minPercent: 20,
  defaultPercent: 30,
  split: "vertical"
});

const treeRef = ref(null);

interface SysRoleType {
  id: number;
  code: string;
  label: string;
  children?: SysRoleType[];
}

/** 点击角色 */
const handleNodeClick = (data: SysRoleType) => {
  console.log(data.code);
  getAuthAll(data.code);
  currentRoleCode.value = data.code;

  const currentId = data.id;
  // 清除其他所有节点的选择状态
  treeRef.value.setCheckedKeys([currentId]);
};
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">权限管理</span>
        </div>
      </template>
      <div class="split-pane">
        <splitpane :splitSet="settingLR">
          <!-- #paneL 表示指定该组件为左侧面板 -->
          <template #paneL>
            <!-- 自定义左侧面板的内容 -->
            <div class="dv-a">
              <el-card class="box-card">
                <template #header>
                  <span>角色权限</span>
                </template>
                <el-tree
                  ref="treeRef"
                  node-key="id"
                  :data="roleData"
                  :props="defaultProps"
                  show-checkbox
                  @node-click="handleNodeClick"
                />
              </el-card>

              <el-card class="box-card">
                <template #header>
                  <span>数据权限</span>
                </template>
                <el-select
                  v-model="value"
                  class="m-2"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-card>
            </div>
          </template>
          <!-- #paneR 表示指定该组件为右侧面板 -->
          <template #paneR>
            <div class="dv-b">
              <el-collapse v-model="activeNames">
                <el-collapse-item
                  v-for="(item, index) in sysMenuTitleVoData"
                  :key="index"
                  :name="item.id"
                >
                  <template v-slot:title>
                    <span class="collapse-title">{{ item.title }}</span>
                  </template>
                  <el-checkbox
                    v-model="item.isCheckAll"
                    :indeterminate="!item.isCheckAll"
                    @change="handleCheckAllChange(item.id, item.isCheckAll)"
                    >全部</el-checkbox
                  >
                  <el-checkbox-group v-model="item.useAuthList">
                    <el-checkbox
                      v-for="one in item.authList"
                      :key="one.id"
                      :label="one.id"
                      :value="one.id"
                      @change="setCheck(item.id)"
                    >
                      {{ one.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </splitpane>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
$W: 100%;
$H: 70vh;

.card {
  overflow-y: auto; /* 开启滚动显示溢出内容 */
}

.split-pane {
  width: 86vw;
  height: $H;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e6eb;

  .dv-a,
  .dv-b {
    width: $W;
    height: $W;
    padding-top: 10px;
    color: rgba($color: dodgerblue, $alpha: 80%);
  }

  .dv-b {
    padding-left: 20px;
    color: rgba($color: #000, $alpha: 80%);
  }
}

.text {
  font-size: 15px;
}

.box-card {
  width: $W;
  margin: 2px 5px;

  :deep(.el-card__header) {
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: lightblue;
  }
}

:deep(.el-card__body) {
  padding-top: 6px;
  padding-right: 0;
  padding-left: 0;
}

:deep(.el-tree-node) {
  height: 33px;
}

:deep(.collapse-title) {
  flex: 1 0 90%;
  order: 1;
  font-size: 14px;

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
}

:deep(.el-collapse-item__arrow.is-active) {
  transform: rotate(-90deg);
}
//  默认方向
:deep(.el-collapse-item__arrow),
:deep(.el-tabs__nav) {
  transform: rotate(90deg);
}

:deep(.el-checkbox__label) {
  font-size: 13px;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: #d7e0ee;
}
</style>
