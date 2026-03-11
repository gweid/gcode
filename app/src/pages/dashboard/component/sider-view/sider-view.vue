<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '@store/menu.js';
import SiderContainer from '@component/sider-container/sider-container.vue';
import SubMenu from './sub-menu/sub-menu.vue';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const activeKey = ref('');

const setActiveKey = () => {
  let siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key,
  });

  // 如果首次加载 sider-view，用户未选中左侧菜单，默认第一个
  if (!siderMenuItem) {
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key,
    });

    if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
      const sideMenuList = menuItem.siderConfig.menu;
      // 因为可能深层嵌套，所以使用方法递归去处理
      siderMenuItem = menuStore.findFirstMenuItem(sideMenuList);

      if (siderMenuItem) {
        handleMenuSelect(siderMenuItem.key);
      }
    }
  }

  activeKey.value = siderMenuItem?.key;
};

watch(
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setActiveKey();
    setMenuList();
  },
  { deep: true },
);

const menuList = ref([]);

const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });

  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu;
  }
};

const handleMenuSelect = (menuKey) => {
  if (menuKey === route.query.sider_key) return;

  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });

  const { moduleType, customConfig } = menuItem;

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };

  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      proj_key: route.query.proj_key,
      sider_key: menuKey,
    },
  });
};

const onMenuSelect = (menuKey) => {
  handleMenuSelect(menuKey);
};

onMounted(() => {
  setActiveKey();
  setMenuList();
});
</script>

<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList" :key="item.key">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view />
    </template>
  </sider-container>
</template>

<style lang="less" scoped></style>
