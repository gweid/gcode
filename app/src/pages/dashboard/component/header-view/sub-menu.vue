<script setup>
const { menuItem } = defineProps(['menuItem']);
</script>

<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>
      {{ menuItem.name }}
    </template>
    <div v-for="item in menuItem.subMenu" :key="item.key">
      <SubMenu v-if="item.subMenu" :menu-item="item" />
      <el-menu-item v-else :index="item.key">
        {{ item.name }}
      </el-menu-item>
    </div>
  </el-sub-menu>
</template>

<style lang="less" scoped></style>
