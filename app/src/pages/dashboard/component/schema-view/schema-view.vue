<script setup>
import { provide } from 'vue';
import SearchPanel from './search-panel/search-panel.vue';
import TablePanel from './table-panel/table-panel.vue';
import { useSchema } from './hook/use-schema';

const { api, tableSchema, tableConfig } = useSchema();

// 提供数据（方便做透传）
provide('schemaViewData', {
  api,
  tableSchema,
  tableConfig,
});
</script>

<template>
  <el-row class="schema-view">
    <search-panel />
    <table-panel />
  </el-row>
</template>

<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
