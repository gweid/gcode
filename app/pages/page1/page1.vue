<script setup>
import { ref } from 'vue';
import { addTag } from '@utils/tools';

const content = ref('');
console.log('aaa');
</script>

<template>
  <div class="wrapper">
    <h1>Page 1</h1>
    <input v-model="content" />
    <p>{{ content ? addTag(content) : '' }}</p>
    <p>HMR 测试</p>
  </div>
</template>

<style scoped lang="less">
h1 {
  color: red;
}
</style>
