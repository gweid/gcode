import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@store/menu';

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref('');
  const searchSchema = ref({});
  const tableSchema = ref({});

  // 构造 schemaConfig 相关配置，输送给 schemaView 解析
  const buildData = () => {
    const { key, sider_key: siderKey } = route.query;

    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key,
    });

    if (menuItem && menuItem.schemaConfig) {
      const { schemaConfig: { api = '' } = {} } = menuItem;

      api.value = api;
    }
  };

  watch(
    [() => route.query.key, () => route.query.sider_key, () => menuStore.menuList],
    () => {
      buildData();
    },
    { deep: true },
  );

  onMounted(() => {
    buildData();
  });

  return {
    api,
    searchSchema,
    tableSchema,
  };
};
