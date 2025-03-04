import { onMounted, reactive, ref } from "vue";
import { ElMessage, type FormRules } from "element-plus";
import { getSafePolicy, updateSafePolicy } from "@/api/system";
import { SUCCESS } from "@/api/base";

export function useSysSeting() {
  const addForm = ref({
    type: "sys_security_policy",
    sysLoginMaxLockTime: "5分钟",
    sysLoginMaxTryCount: "5次",
    sysPassLength: 11,
    sysPassShortLength: 8,
    sysPassChange: "5天",
    sysOvertime: "30分钟",
    passCom: "密码是数字，字母组合"
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
      type: "sys_security_policy",
      sysLoginMaxLockTime: "5分钟",
      sysLoginMaxTryCount: "5次",
      sysPassLength: 11,
      sysPassShortLength: 8,
      sysPassChange: "5天",
      sysOvertime: "30分钟",
      passCom: "密码是数字，字母组合"
    };
  };

  const getSysSeting = () => {
    getSafePolicy().then(res => {
      if (res.code === SUCCESS) {
        addForm.value = res.data;
      }
    });
  };

  onMounted(() => {
    getSysSeting();
  });

  const addFormInfo = ref => {
    console.log("保存", ref);
    updateSafePolicy(addForm.value).then(res => {
      if (res.code === SUCCESS) {
        ElMessage.success("保存成功，新的配置将会在下次登录生效！");
      } else {
        ElMessage.error(res.msg);
      }
    });
  };

  return {
    addForm,
    rules,
    cancel,
    addFormInfo
  };
}
