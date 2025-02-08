<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Down from "@iconify-icons/ep/arrow-down";
import Up from "@iconify-icons/ep/arrow-up";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { useProjCer } from "@/views/otacertifi/projcer/hook";
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { PureTableBar } from "@/components/RePureTableBar";
import Download from "@iconify-icons/ep/download";
import DeleteBin from "@iconify-icons/ri/delete-bin-2-line";
import { hasAuth } from "@/router/utils";
import More from "@iconify-icons/ep/more-filled";
import Password from "@iconify-icons/ri/lock-password-line";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";

defineOptions({
  name: "projCer"
});

const formRef = ref();
const addFormRef = ref<FormInstance>();
const treeRef = ref(null);
const isCollapsed = ref(false);
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const {
  queryForm,
  loading,
  columns,
  dataList,
  pagination,
  dialogFormVisible,
  title,
  addForm,
  rules,
  moreCondition,
  projInfo,
  projOption,
  deftCheck,
  isUpdateProj,
  handleDown,
  getCerInfo,
  cancel,
  restartForm,
  submitForm,
  openDia,
  onSearch,
  handleUpdate,
  handleUpdateProj,
  handleDelete,
  handleLoseEfficacy,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useProjCer();

interface ClientCa {
  id: number;
  label: string;
  children?: ClientCa[];
}

const handleNodeClick = (data: ClientCa) => {
  console.log(data);
  const currentId = data.id;
  treeRef.value.setCheckedKeys([currentId]);
  getCerInfo(data.id);
};

const defaultProps = {
  children: "children",
  label: "label"
};
</script>

<template>
  <div class="main">
    <el-container>
      <el-aside :width="isCollapsed ? '15px' : '240px'" class="asideStyle">
        <div class="left-collapse">
          <IconifyIconOffline
            v-tippy="{
              content: isCollapsed ? '展开' : '折叠',
              theme: 'light',
              hideOnClick: 'toggle',
              placement: 'right'
            }"
            :icon="MenuFold"
            :style="{ transform: isCollapsed ? 'none' : 'rotateY(180deg)' }"
            @click="toggleCollapse"
          />
        </div>
        <div
          class="h-full bg-bg_color"
          :style="{ paddingTop: '20px', width: '240px' }"
        >
          <p class="flex justify-center font-bold text-base truncate pb-2">
            项目列表
          </p>
          <el-tree
            ref="treeRef"
            node-key="id"
            :default-checked-keys="deftCheck"
            :data="projInfo"
            :props="defaultProps"
            show-checkbox
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <el-form
          ref="formRef"
          :inline="true"
          :model="queryForm"
          class="bg-bg_color w-[99/100] pl-8 pt-4"
        >
          <el-form-item label="证书名称" prop="name">
            <el-input
              v-model="queryForm.name"
              placeholder="请输入证书名称"
              clearable
              class="!w-[150px]"
            />
          </el-form-item>
          <el-form-item label="证书类型" prop="type">
            <el-select
              v-model="queryForm.type"
              placeholder="请选择证书类型"
              class="!w-[150px]"
            >
              <el-option label="CA证书" value="ca" />
              <el-option label="客户端证书" value="client" />
              <el-option label="服务器证书" value="server" />
            </el-select>
          </el-form-item>
          <el-form-item label="域名" prop="name">
            <el-input
              v-model="queryForm.domain"
              placeholder="请输入域名"
              clearable
              class="!w-[150px]"
            />
          </el-form-item>
          <el-form-item label="状态" prop="name">
            <el-select
              v-model="queryForm.status"
              placeholder="请输入证书状态"
              class="!w-[150px]"
            >
              <el-option label="未生效" value="未生效" />
              <el-option label="已使用" value="已使用" />
              <el-option label="已废弃" value="已废弃" />
            </el-select>
          </el-form-item>

          <el-collapse-transition>
            <div v-show="moreCondition">
              <el-form-item label="开始时间：" prop="beginTime">
                <el-date-picker
                  v-model="queryForm.beginTime"
                  type="date"
                  placeholder="请输入开始时间"
                  class="!w-[180px]"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                  v-model="queryForm.endTime"
                  placeholder="请输入结束时间"
                  type="date"
                  class="!w-[180px]"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </div>
          </el-collapse-transition>

          <el-form-item>
            <el-button
              type="primary"
              :icon="useRenderIcon(Search)"
              :loading="loading"
              @click="onSearch"
            >
              搜索
            </el-button>
            <el-button
              :icon="useRenderIcon(Refresh)"
              @click="restartForm(formRef)"
            >
              重置
            </el-button>
            <el-button
              link
              :icon="moreCondition ? useRenderIcon(Down) : useRenderIcon(Up)"
              @click="moreCondition = !moreCondition"
            />
          </el-form-item>
        </el-form>

        <PureTableBar title="证书列表" :columns="columns" @refresh="onSearch">
          <template #buttons>
            <el-button
              v-if="hasAuth('projcer_add')"
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="openDia('新增证书', addFormRef)"
            >
              添加
            </el-button>
          </template>
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
              @selection-change="handleSelectionChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
              <template #operation="{ row }">
                <el-popconfirm
                  title="是否确认废弃?"
                  @confirm="handleLoseEfficacy(row)"
                >
                  <template #reference>
                    <el-button
                      v-if="hasAuth('projcer_discard')"
                      class="reset-margin"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(DeleteBin)"
                    >
                      废弃
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  v-if="row.status === '未生效' && hasAuth('projcer_update')"
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(EditPen)"
                  @click="handleUpdate(row, addFormRef)"
                >
                  修改
                </el-button>

                <el-dropdown :hide-on-click="false">
                  <el-button
                    class="ml-3 mt-[2px]"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(More)"
                  />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="row.type !== 'ca'">
                        <el-popconfirm
                          title="下载后证书状态将变成已使用，是否确认下载？"
                          @confirm="handleDown(row)"
                        >
                          <template #reference>
                            <el-button
                              v-if="hasAuth('projcer_down')"
                              class="reset-margin"
                              link
                              type="primary"
                              :size="size"
                              :icon="useRenderIcon(Download)"
                            >
                              下载
                            </el-button>
                          </template>
                        </el-popconfirm>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="
                            hasAuth('projcer_update_proj') &&
                            row.status != '未生效' &&
                            row.status != '已废弃'
                          "
                          class="reset-margin"
                          link
                          type="primary"
                          :size="size"
                          :icon="useRenderIcon(EditPen)"
                          @click="handleUpdateProj(row, addFormRef)"
                        >
                          修改项目
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-popconfirm
                          v-if="
                            row.status === '未生效' || row.status === '已废弃'
                          "
                          title="是否确认删除?"
                          @confirm="handleDelete(row)"
                        >
                          <template #reference>
                            <el-button
                              v-if="hasAuth('projcer_del')"
                              class="reset-margin"
                              link
                              type="primary"
                              :size="size"
                              :icon="useRenderIcon(Delete)"
                            >
                              删除
                            </el-button>
                          </template>
                        </el-popconfirm>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </el-main>
    </el-container>

    <el-dialog v-model="dialogFormVisible" :title="title" @close="cancel">
      <el-form
        ref="addFormRef"
        :model="addForm.value"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="所属项目" prop="projArray">
          <el-select
            v-model="addForm.value.projArray"
            clearable
            multiple
            placeholder="请选择项目"
            style="width: 200px"
          >
            <el-option
              v-for="item in projOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="证书名称" prop="name">
          <el-input
            v-model="addForm.value.name"
            :disabled="isUpdateProj"
            placeholder="请输入证书名称"
          />
        </el-form-item>
        <el-form-item label="证书类型" prop="type">
          <el-select
            v-model="addForm.value.type"
            :disabled="isUpdateProj"
            placeholder="请选择证书类型"
            class="!w-[200px]"
          >
            <el-option label="CA证书" value="ca" />
            <el-option label="客户端证书" value="client" />
            <el-option label="服务器证书" value="server" />
          </el-select>
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input
            v-model="addForm.value.domain"
            :disabled="isUpdateProj"
            placeholder="请输入域名"
          />
        </el-form-item>

        <el-form-item
          v-if="addForm.value.expiryData !== '自定义'"
          label="失效时间"
          prop="expiryData"
        >
          <el-select
            v-model="addForm.value.expiryData"
            :disabled="isUpdateProj"
            placeholder="请选择失效时间"
            class="!w-[200px]"
          >
            <el-option label="30天" :value="30" />
            <el-option label="3个月" :value="90" />
            <el-option label="6个月" :value="180" />
            <el-option label="1年" :value="365" />
            <el-option label="3年" :value="1095" />
            <el-option label="5年" :value="1825" />
            <el-option label="自定义" value="自定义" />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="失效时间" prop="commonExpireDta">
          <el-date-picker
            v-model="addForm.value.commonExpireDta"
            :disabled="isUpdateProj"
            type="date"
            placeholder="请输入失效时间"
            class="!w-[200px]"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.value.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitForm(addFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-main) {
  --el-main-padding: 0;

  padding-left: 20px;
}

:deep(.el-tree-node) {
  font-weight: bold;
}

.asideStyle {
  position: relative;
  overflow: hidden hidden;
}

.left-collapse {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
