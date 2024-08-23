<script setup lang="ts">
import { useSysSeting } from "./hook";
import { ref } from "vue";
const { addForm, rules, cancel, addFormInfo } = useSysSeting();

const addFormRef = ref();

defineOptions({
  name: "sysSeting"
});
</script>

<template>
  <div class="main">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :inline="true"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="锁定时常" prop="sysLoginMaxLockTime">
        <el-select
          v-model="addForm.sysLoginMaxLockTime"
          placeholder="请选择锁定时长"
          style="width: 200px"
        >
          <el-option label="5分钟" value="5" />
          <el-option label="10分钟" value="10" />
          <el-option label="15分钟" value="15" />
          <el-option label="30分钟" value="30" />
        </el-select>
      </el-form-item>

      <el-form-item label="最大尝试次数" prop="sysLoginMaxTryCount">
        <el-select
          v-model="addForm.sysLoginMaxTryCount"
          placeholder="请选择最大尝试次数"
          style="width: 200px"
        >
          <el-option label="5次" value="5" />
          <el-option label="10次" value="10" />
          <el-option label="15次" value="15" />
          <el-option label="30次" value="30" />
        </el-select>
      </el-form-item>

      <el-form-item label="密码长度" prop="sysPassLength">
        <div class="flex items-center">
          <el-select
            v-model="addForm.sysPassShortLength"
            placeholder="请输入密码最短长度"
            style="width: 84px; margin-right: 16px"
          >
            <el-option label="8" value="8" />
            <el-option label="9" value="9" />
            <el-option label="10" value="10" />
          </el-select>
          <el-select
            v-model="addForm.sysPassLength"
            placeholder="请输入密码最长长度"
            style="width: 100px"
          >
            <el-option label="11" value="11" />
            <el-option label="12" value="12" />
            <el-option label="13" value="13" />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="密码有效期" prop="sysPassChange">
        <el-select
          v-model="addForm.sysPassChange"
          placeholder="请选择密码有效期"
          style="width: 200px"
        >
          <el-option label="5天" value="5" />
          <el-option label="7天" value="7" />
          <el-option label="14天" value="14" />
          <el-option label="30天" value="30" />
        </el-select>
      </el-form-item>
      <el-form-item label="密码强度" prop="passCom">
        <el-select
          v-model="addForm.passCom"
          placeholder="请选择密码强度"
          style="width: 200px"
        >
          <el-option label="密码是数字" value="1" />
          <el-option label="密码是数字，字母组合" value="2" />
          <el-option label="密码是数字，字母，特殊字符组合" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="密码超时时间" prop="sysOvertime">
        <el-select
          v-model="addForm.sysPassChange"
          placeholder="请选择密码超时时间"
          style="width: 200px"
        >
          <el-option label="15分钟" value="900" />
          <el-option label="30分钟" value="1800" />
          <el-option label="1小时" value="3600" />
        </el-select>
      </el-form-item>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="addFormInfo(addFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}
</style>
