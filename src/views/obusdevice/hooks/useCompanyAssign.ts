import { ref } from "vue";
import { SUCCESS } from "@/api/base";
import { message } from "@/utils/message";
import { getCompanyTree } from "@/api/system";

type CompanyApi = (param?: object) => Promise<any>;

/**
 * 多租户归属公司分配/转移通用逻辑（与 feat/ota 分支的多租户方案保持一致）
 *
 * @param options.assignApi   分配到公司的接口
 * @param options.transferApi 转移所属公司的接口
 * @param options.onFinished  成功后的回调（一般为刷新列表 onSearch）
 */
export function useCompanyAssign(options: {
  assignApi: CompanyApi;
  transferApi: CompanyApi;
  onFinished?: () => void;
}) {
  const companyDialogVisible = ref(false);
  // 正在操作的行；transfer=true 表示转移（已分配过公司），否则为首次分配
  const assigningRow = ref<any>(null);
  const selectedCompanyId = ref<number | null>(null);
  const companyTree = ref([]);

  // 公司树中仅允许选择公司类型节点
  function filterCompanyTree(nodes) {
    return nodes.map(node => ({
      ...node,
      disabled: node.type !== "company",
      children: filterCompanyTree(node.children || [])
    }));
  }

  // 打开分配/转移弹框并加载公司组织树
  async function openAssignDialog(row, transfer = false) {
    assigningRow.value = { ...row, transfer };
    selectedCompanyId.value = null;
    try {
      const { data } = await getCompanyTree();
      companyTree.value = filterCompanyTree(data || []);
    } catch (error) {
      console.error("获取公司组织树失败", error);
      companyTree.value = [];
    }
    companyDialogVisible.value = true;
  }

  function handleCloseCompanyDialog() {
    companyDialogVisible.value = false;
    assigningRow.value = null;
    selectedCompanyId.value = null;
  }

  function handleConfirmCompany() {
    if (!assigningRow.value) {
      return;
    }
    const transfer = !!assigningRow.value.transfer;
    if (!selectedCompanyId.value) {
      message(transfer ? "请选择目标单位" : "请选择单位", { type: "warning" });
      return;
    }
    const api = transfer ? options.transferApi : options.assignApi;
    const param = {
      id: assigningRow.value.id,
      companyId: selectedCompanyId.value
    };
    api(param).then(res => {
      if (res.code === SUCCESS) {
        message(transfer ? "转移成功！" : "分配成功！", { type: "success" });
        handleCloseCompanyDialog();
        options.onFinished?.();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  return {
    companyDialogVisible,
    assigningRow,
    selectedCompanyId,
    companyTree,
    openAssignDialog,
    handleConfirmCompany,
    handleCloseCompanyDialog
  };
}
