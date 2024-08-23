import { reactive, ref } from "vue";
import type { FormRules } from "element-plus";

export function useSysSeting() {
  const addForm = ref({
    sysLoginMaxLockTime: 5,
    sysLoginMaxTryCount: 5,
    sysPassLength: 10,
    sysPassShortLength: 8,
    sysPassChange: 5,
    sysOvertime: 1800,
    passCom: 1
  });

  const rules = reactive<FormRules>({
    sysLoginMaxLockTime: [
      { required: true, message: "锁定时常必填", trigger: "change" }
    ],
    sysLoginMaxTryCount: [
      { required: true, message: "最大尝试次数必填", trigger: "blur" }
    ],
    sysPassLength: [
      { required: true, message: "密码长度必填", trigger: "change" }
    ],
    sysPassShortLength: [
      { required: true, message: "密码长度必填", trigger: "change" }
    ],
    sysPassChange: [
      { required: true, message: "密码更换周期必填", trigger: "change" }
    ],
    sysOvertime: [
      { required: true, message: "超时时间必填", trigger: "change" }
    ],
    passCom: [{ required: true, message: "密码复杂度必填", trigger: "change" }]
  });

  const cancel = () => {
    addForm.value = {
      sysLoginMaxLockTime: 5,
      sysLoginMaxTryCount: 5,
      sysPassLength: 10,
      sysPassShortLength: 8,
      sysPassChange: 5,
      sysOvertime: 1800,
      passCom: 1
    };
  };
  const addFormInfo = ref => {
    console.log("保存", ref);
  };

  return {
    addForm,
    rules,
    cancel,
    addFormInfo
  };
}
