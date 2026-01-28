<script setup>
import { ref } from 'vue';
const content = ref('');
</script>

<template>
  <div class="wrapper">
    <h1>Page 2</h1>
    <input v-model="content" />
    <p>{{ content }}</p>
  </div>
</template>

<style scoped lang="less">
h1 {
  color: blue;
}
</style>
