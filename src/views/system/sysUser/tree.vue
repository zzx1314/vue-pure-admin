<script setup lang="ts">
import { getDeptList } from "@/api/system";
import { handleTree } from "@/utils/tree";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick
} from "vue";

import Dept from "@iconify-icons/ri/git-branch-line";
import Reset from "@iconify-icons/ri/restart-line";
import Search from "@iconify-icons/ep/search";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";
import { SUCCESS } from "@/api/base";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

const treeRef = ref();
const treeData = ref<Tree[]>([]);
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "reset-margin",
    "!text-gray-500",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

const emit = defineEmits([
  "updatePage",
  "setOrgId",
  "setOrgIds",
  "setOrgName",
  "setTreeData"
]);

/** 点击节点 */
function nodeClick(value) {
  console.log(value);
  const nodeId = value.id;
  console.log(nodeId);
  highlightMap.value[nodeId] = {
    id: nodeId,
    highlight: true
  };
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  console.log("highlightMap", highlightMap.value);
  const resultId = [];
  getOrgIds(value.id, treeData.value, resultId);
  console.log("resultId", resultId);
  emit("setOrgIds", resultId);

  emit("setOrgId", value.id);
  emit("setOrgName", value.name);
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const tree = treeRef.value;
  if (!tree?.store) return;
  const nodes = tree.store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

/** 重置状态（选中状态、搜索框值、树初始化） */
function onReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

watch(searchValue, val => {
  treeRef.value?.filter(val);
});

onMounted(async () => {
  const res = await getDeptList();
  if (res.code !== SUCCESS) return;

  // /allList 返回扁平组织列表，必须先转换为树
  treeData.value = handleTree(res.data || []);
  emit("setTreeData", treeData.value);

  const firstNode = treeData.value[0];
  if (!firstNode) {
    emit("setOrgIds", []);
    return;
  }

  nextTick(() => {
    highlightMap.value[firstNode.id] = {
      id: firstNode.id,
      highlight: true
    };
  });

  const resultId: number[] = [];
  getOrgIds(firstNode.id, treeData.value, resultId);
  emit("setOrgIds", resultId);
  emit("setOrgId", firstNode.id);
  emit("setOrgName", firstNode.name);
});

/** 遍历树获取orgIds */
function getOrgIds(orgId: number, treeData: Tree[], result: number[]) {
  const findTreeData: Tree[] = [];
  findOrgTree(orgId, treeData, findTreeData);
  result.push(orgId);
  getOrgIdsOne(findTreeData, result);
}

function getOrgIdsOne(treeData: Tree[], result: number[]) {
  for (const oneItem of treeData) {
    result.push(oneItem.id);
    if (oneItem.children?.length) {
      getOrgIdsOne(oneItem.children, result);
    }
  }
}

/** 获取的点击的子节点 */
function findOrgTree(orgId: number, treeData: Tree[], result: Tree[]) {
  for (const oneItem of treeData) {
    if (oneItem.id === orgId) {
      if (oneItem.children?.length) {
        result.push(...oneItem.children);
      }
      return;
    } else {
      if (oneItem.children?.length) {
        findOrgTree(orgId, oneItem.children, result);
      }
    }
  }
}
</script>

<template>
  <div
    class="h-full bg-bg_color overflow-auto"
    :style="{ minHeight: `calc(100vh - 141px)` }"
  >
    <div class="flex items-center h-[34px]">
      <p class="flex-1 ml-2 font-bold text-base truncate" title="部门列表">
        部门列表
      </p>
      <el-input
        v-model="searchValue"
        style="flex: 2"
        size="small"
        placeholder="请输入部门名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              :icon="Search"
            />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown :hide-on-click="false">
        <IconifyIconOffline
          class="w-[28px] cursor-pointer"
          width="18px"
          :icon="More2Fill"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
                @click="toggleRowExpansionAll(isExpand ? false : true)"
              >
                {{ isExpand ? "折叠全部" : "展开全部" }}
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="useRenderIcon(Reset)"
                @click="onReset"
              >
                重置状态
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-tree
      ref="treeRef"
      :data="treeData"
      node-key="id"
      size="small"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <span
          :class="[
            'pl-1',
            'pr-1',
            'rounded',
            'flex',
            'items-center',
            'select-none',
            searchValue.trim().length > 0 &&
              node.label.includes(searchValue) &&
              'text-red-500',
            highlightMap[node.data.id]
              ? highlightMap[node.data.id].highlight
                ? 'var(--el-color-primary-light-7)'
                : ''
              : ''
          ]"
          :style="{
            background: highlightMap[node.data.id]
              ? highlightMap[node.data.id].highlight
                ? 'var(--el-color-primary-light-7)'
                : 'transparent'
              : 'transparent'
          }"
        >
          <IconifyIconOffline
            :icon="
              data.type === 'top'
                ? OfficeBuilding
                : data.type === 'company'
                  ? LocationCompany
                  : Dept
            "
          />
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}
</style>
