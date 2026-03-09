import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref([]);

  const setMenuList = (list) => {
    menuList.value = list;
  };

  const findMenuItem = ({ key, value }, list = menuList.value) => {
    // 可能有 subMenu，需要递归处理
    for (let i = 0, len = list.length; i < len; i++) {
      const menuItem = list[i];
      const { menuType, moduleType } = menuItem;

      if (menuItem[key] === value) return menuItem;

      // 有子 subMenu
      if (menuType === 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu);

        if (mItem) return mItem;
      }

      if (moduleType === 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu);
        if (mItem) return mItem;
      }
    }
  };

  const findFirstMenuItem = (list = menuList.value) => {
    if (!list || !list[0]) return;

    let firstMenuItem = list[0];

    if (firstMenuItem.subMenu) {
      firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu);
    }

    return firstMenuItem;
  };

  return {
    menuList,
    setMenuList,
    findMenuItem,
    findFirstMenuItem,
  };
});
