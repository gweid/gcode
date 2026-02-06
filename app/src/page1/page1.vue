<script setup>
import { ref, onMounted } from 'vue';
import { addTag } from '@utils/tools';
import request from '@utils/request';

const content = ref('');

onMounted(async () => {
  const res = await request({
    method: 'get',
    url: '/api/project/list',
    query: {
      proj_key: '11',
    },
  });

  console.log(res);
});
</script>

<template>
  <div class="wrapper">
    <h1>Page 1</h1>
    <el-input v-model="content" style="width: 300px" />
    <p>{{ content ? addTag(content) : '' }}</p>
    <p>HMR 测试</p>
  </div>
</template>

<style scoped lang="less">
h1 {
  color: red;
}
</style>
