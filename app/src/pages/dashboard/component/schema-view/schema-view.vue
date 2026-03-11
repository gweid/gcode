<script setup>
import { onMounted } from 'vue';
// import { useRoute } from 'vue-router';
import SearchPanel from './search-panel/search-panel.vue';
import TablePanel from './table-panel/table-panel.vue';
// import { useSchema } from './hook/use-schema';

// const route = useRoute();
// const { api } = useSchema();

onMounted(() => {});
</script>

<template>
  <el-row>
    <search-panel />
    <table-panel />
  </el-row>
</template>

<style lang="less" scoped></style>
