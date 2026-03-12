import { ref, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@store/menu';

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref('');
  const searchSchema = ref({});
  const searchConfig = ref({});
  const tableSchema = ref({});
  const tableConfig = ref({});

  // 构造 schemaConfig 相关配置，输送给 schemaView 解析
  const buildData = () => {
    const { key, sider_key: siderKey } = route.query;

    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key,
    });

    if (menuItem && menuItem.schemaConfig) {
      const { schemaConfig = {} } = menuItem;

      const configSchema = JSON.parse(JSON.stringify(schemaConfig.schema));

      api.value = schemaConfig.api ?? '';
      tableSchema.value = {};
      tableConfig.value = undefined;

      nextTick(() => {
        tableSchema.value = buildDtoSchema(configSchema, 'table');
        tableConfig.value = schemaConfig.tableConfig;
      });
    }
  };

  // 通用构建方法（清除数据噪音）
  // 这一步，实际上就是精简数据
  const buildDtoSchema = (schema, comName) => {
    if (!schema.properties) return {};

    const dtoSchema = {
      type: 'object',
      properties: {},
    };

    for (const key in schema.properties) {
      const props = schema.properties[key];

      if (props[`${comName}Option`]) {
        let dtoProps = {};

        // 提取 props 中非 option 的部分，存放到 dtoProps 中
        for (const k in props) {
          if (!k.includes(`Option`)) {
            dtoProps[k] = props[k];
          }
        }

        dtoProps = {
          ...dtoProps,
          option: props[`${comName}Option`],
        };

        dtoSchema.properties[key] = dtoProps;
      }
    }

    return dtoSchema;
  };
  ``;
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
    searchConfig,
    tableSchema,
    tableConfig,
  };
};
