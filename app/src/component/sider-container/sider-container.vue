<script setup></script>

<template>
  <el-container class="sider-container">
    <el-aside class="aside">
      <slot name="menu-content" />
    </el-aside>
    <el-main class="main">
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.sider-container {
  height: 100%;

  .aside {
    width: 200px;
    height: 100%;
    border-right: 1px solid #e8e8e8;
  }

  .main {
    overflow: scroll;
  }
}

:deep(.el-menu) {
  border-right: 0;
}
</style>
