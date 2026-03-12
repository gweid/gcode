<script setup>
import { computed, nextTick, onMounted, ref, toRefs, watch } from 'vue';
import request from '@utils/request';
import useLoading from '@hook/use-loading';

const props = defineProps({
  api: {
    type: String,
    default: '',
  },
  schema: {
    type: Object,
    default: () => {},
  },
  buttons: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['operate']);

const { api, schema, buttons } = toRefs(props);

const { loading, showLoading, hideLoading } = useLoading();

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const operationWidth = computed(() => {
  return buttons?.value?.length > 0
    ? buttons.value.reduce((pre, cur) => {
        return pre + cur.label.length * 18;
      }, 50)
    : 50;
});

const initData = () => {
  currentPage.value = 1;
  pageSize.value = 10;

  nextTick(async () => {
    await fetchTableData();
  });
};

const fetchTableData = async () => {
  if (!api.value) return;

  showLoading();

  const res = await request({
    method: 'get',
    url: `${api.value}/list`,
    query: {
      page: currentPage.value,
      size: pageSize.value,
    },
  });

  hideLoading();

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = [];
    total.value = 0;
    return;
  }

  tableData.value = buildTableData(res.data);
  total.value = res.metaData.total;
};

const buildTableData = (data) => {
  if (!schema.value?.properties) return data;

  return data.map((dataItem) => {
    for (const key in dataItem) {
      const schemaItem = schema.value.properties[key];
      if (schemaItem?.option?.toFixed) {
        dataItem[key] = dataItem[key].toFixed && dataItem[key].toFixed(schemaItem.option.toFixed);
      }
    }
    return item;
  });
};

const operationHandler = ({ btnConfig, rowData }) => {
  emit('operate', { btnConfig, rowData });
};

const onPageSiseChange = async (value) => {
  pageSize.value = value;
  await fetchTableData();
};

const onCurrentPageChange = async (value) => {
  currentPage.value = value;
  await fetchTableData();
};

onMounted(() => {
  initData();
});

watch(
  [api, schema],
  () => {
    initData();
  },
  { deep: true },
);

defineExpose({
  initData,
  fetchTableData,
  showLoading,
  hideLoading,
});
</script>

<template>
  <div class="schema-table">
    <el-table v-if="schema && schema.properties" v-loading="loading" class="table" :data="tableData">
      <template v-for="(schemaItem, key) in schema.properties">
        <!-- schemaItem.option 是 el-table-column 的属性，通过 v-bind 能一次性全部绑定-->
        <el-table-column
          v-if="schemaItem.option.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"
        />
      </template>
      <el-table-column v-if="buttons.length > 0" label="操作" fixed="right" :width="operationWidth">
        <template #default="scope">
          <el-button
            v-for="item in buttons"
            :key="item.label"
            link
            v-bind="item"
            @click="operationHandler({ btnConfig: item, rowData: scope.row })"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSiseChange"
        @current-change="onCurrentPageChange"
      />
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
