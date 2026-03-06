import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref([]);

  const setMenuList = (list) => {
    menuList.value = list;
  };

  return {
    menuList,
    setMenuList,
  };
});
