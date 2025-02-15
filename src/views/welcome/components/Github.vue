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
  getUserInfo().then(res => {
    console.log("getUserInfo", res);
    param.value = {
      orgName: res.data.sysUser.orgName,
      userName: res.data.sysUser.username,
      user: res.data.sysUser.realName,
      role: res.data.roleName,
      desc: res.data.roleDesc
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
