<script setup>
import { ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

defineProps({
  title: {
    type: String,
    default: 'Header Container',
  },
});

const userName = ref('Gweid');

const handleUserCommand = () => {};
</script>

<template>
  <el-container class="header-container">
    <el-header class="header" type="flex" align="middle">
      <el-row type="flex" align="middle" class="header-row">
        <el-row type="flex" align="middle" class="title-panel">
          <img src="./asserts/logo.png" class="logo" />
          <el-row class="text">
            {{ title }}
          </el-row>
        </el-row>
        <el-row class="menu-panel">
          <slot name="menu-content" />
        </el-row>
        <el-row type="flex" justify="end" align="middle" class="setting-panel">
          <slot name="setting-content" />
          <img src="./asserts/avatar.png" class="avatar" />
          <el-dropdown @command="handleUserCommand">
            <span>
              {{ userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;

  .header {
    max-height: 120px;
    border-bottom: 1px solid #e8e8e8;
    width: 100%;
    display: flex;
    align-items: center;

    .header-row {
      width: 100%;

      .title-panel {
        .logo {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 50%;
        }

        .text {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .menu-panel {
        flex: 1;
      }

      .setting-panel {
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin: 0 5px 0 10px;
        }
      }
    }
  }

  .main-container {
  }
}

:deep(.header-container) {
  padding: 0;
}
</style>
