<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { useMenuStore } from '@store/menu';
import { useProjectStore } from '@store/project';
import HeaderContainer from '@component/header-container/header-container.vue';
import SubMenu from './sub-menu.vue';

const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

defineProps({
  projName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['menu-select']);

const activeKey = ref('');

const setActiveKey = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });

  activeKey.value = menuItem?.key;
};

const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });

  emit('menu-select', menuItem);
};

watch(
  () => route.query.key,
  () => {
    setActiveKey();
  },
);

watch(
  () => menuStore.menuList,
  () => {
    setActiveKey();
  },
  { deep: true },
);

const handleProjCommand = (projKey) => {
  const projItem = projectStore.projectList.find((item) => item.key === projKey);

  if (!projItem || !projItem.homePage) return;

  const { origin, pathname } = window.location;

  window.location.replace(`${origin}${pathname}#${projItem.homePage}`);
  window.location.reload();
};

onMounted(() => {
  setActiveKey();
});
</script>

<template>
  <header-container :title="projName">
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" mode="horizontal" @select="onMenuSelect">
        <template v-for="item in menuStore.menuList" :key="item.key">
          <SubMenu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <el-dropdown @command="handleProjCommand">
        <span class="project-list">
          {{ projName }}
          <el-icon v-if="projectStore.projectList.length > 1" class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template v-if="projectStore.projectList.length > 1" #dropdown>
          <el-dropdown-item
            v-for="item in projectStore.projectList"
            :key="item.key"
            :command="item.key"
            :disabled="item.name === projName"
          >
            {{ item.name }}
          </el-dropdown-item>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <!-- 这里是插槽透h，透传到 header-container 中 -->
      <slot name="main-content" />
    </template>
  </header-container>
</template>

<style lang="less" scoped>
.project-list {
  margin-right: 20px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  outline: none;
}
</style>
