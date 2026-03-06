<script setup>
import { ref, onMounted } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import request from '@utils/request';
import { useMenuStore } from '@store/menu';
import { useProjectStore } from '@store/project';
import HeaderView from './component/header-view/header-view.vue';

const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projName = ref('');

const getProjectList = async () => {
  const res = await request({
    method: 'get',
    url: '/api/project/list',
    query: {
      proj_key: 'douyin',
    },
  });

  if (!res || !res.success || !res.data) return;

  projectStore.setProjectList(res.data);
};

const getProjectConfig = async () => {
  const res = await request({
    method: 'get',
    url: '/api/project',
    query: {
      proj_key: 'douyin',
    },
  });

  if (!res || !res.success || !res.data) return;

  const { name, menu } = res.data;
  projName.value = name;
  menuStore.setMenuList(menu);
};

onMounted(() => {
  getProjectList();
  getProjectConfig();
});
</script>

<template>
  <el-config-provider :locale="zhCn">
    <HeaderView :proj-name="projName" />
  </el-config-provider>
</template>

<style lang="less" scoped></style>
