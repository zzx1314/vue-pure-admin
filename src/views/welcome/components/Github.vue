<script setup lang="ts">
import { useColumns } from "./columns";
import { ref, onMounted, reactive } from "vue";
import { getUserInfo } from "@/api/system";

const param = ref({
  orgName: "",
  userName: "",
  user: "",
  role: "",
  desc: ""
});

const list = reactive([]);

const getData = () => {
  getUserInfo()
    .then(res => {
      console.log("getUserInfo", res);
      const data = res?.data;
      const sysUser = data?.sysUser;
      if (!sysUser) return;
      param.value = {
        orgName: sysUser.orgName ?? "",
        userName: sysUser.username ?? "",
        user: sysUser.realName ?? "",
        role: data.roleName ?? "",
        desc: data.roleDesc ?? ""
      };
      const { columnsA, columnsC } = useColumns(param);
      list.push({
        columns: columnsA,
        column: 4
      });
      list.push({
        columns: columnsC,
        column: 1
      });
    })
    .catch(error => {
      console.error("获取用户信息失败", error);
    });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <PureDescriptions
    v-for="(item, index) in list"
    :key="index"
    :columns="item.columns"
    :column="item.column"
    direction="vertical"
    border
  />
</template>
