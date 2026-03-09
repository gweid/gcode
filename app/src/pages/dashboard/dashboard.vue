<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import request from '@utils/request';
import { useMenuStore } from '@store/menu';
import { useProjectStore } from '@store/project';
import HeaderView from './component/header-view/header-view.vue';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projName = ref('');

const getProjectList = async () => {
  const res = await request({
    method: 'get',
    url: '/api/project/list',
    query: {
      proj_key: route.query.proj_key,
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
      proj_key: route.query.proj_key,
    },
  });

  if (!res || !res.success || !res.data) return;

  const { name, menu } = res.data;
  projName.value = name;

  menuStore.setMenuList(menu);
};

const onMenuSelect = (menuItem) => {
  const { key, moduleType, customConfig } = menuItem;

  if (key === route.query.key) return;

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };

  router.push({
    path: pathMap[moduleType],
    query: {
      key,
      proj_key: route.query.proj_key,
    },
  });
};

onMounted(() => {
  getProjectList();
  getProjectConfig();
});
</script>

<template>
  <el-config-provider :locale="zhCn">
    <HeaderView :proj-name="projName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view />
      </template>
    </HeaderView>
  </el-config-provider>
</template>

<style lang="less" scoped></style>
