<script setup>
import { onMounted, ref } from 'vue';
import request from '@utils/request';
import HeaderContainer from '@component/header-container/header-container.vue';

const loading = ref(false);
const modelList = ref([]);

const getModellist = async () => {
  loading.value = true;

  const res = await request({
    url: '/api/project/model_list',
    method: 'get',
    errorMessage: '获取项目列表失败',
  });

  loading.value = false;

  if (!res || !res.success || !res.data) {
    return;
  }

  modelList.value = res.data;
};

const onEnter = (proj) => {
  console.log('进入项目:', proj.name);
};

onMounted(() => {
  getModellist();
});
</script>

<template>
  <HeaderContainer title="项目列表">
    <template #main-content>
      <div v-loading="loading">
        <div v-for="item in modelList" :key="item.model?.key">
          <!-- 展示 model -->
          <div class="model-panel">
            <el-row align="middle">
              <div class="title">
                {{ item.model?.name }}
              </div>
            </el-row>
            <div class="divider" />
          </div>
          <!-- 展示 project -->
          <el-row class="project-list">
            <el-card v-for="proj in item.project" :key="proj.key" class="project-card">
              <template #header>
                <div class="title">
                  <span>{{ proj.name }}</span>
                </div>
              </template>
              <div class="content">
                {{ proj.desc ?? '--' }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button link type="primary" @click="onEnter(proj)"> 进入 </el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </HeaderContainer>
</template>

<style lang="less" scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;

  .title {
    font-size: 25px;
    font-weight: blod;
    color: #000;
  }

  .divider {
    margin-top: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
}

.project-list {
  margin: 0 50px;

  .project-card {
    margin: 0 30px 0 20px;
    min-width: 300px;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #47a2ff;
    }

    .content {
      height: 70px;
      font-size: 16px;
      overflow: scroll;
    }
  }
}
</style>
