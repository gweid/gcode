import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { createRouter, createWebHashHistory } from 'vue-router';

import pinia from '@store';

import '@assets/reset.css';

/**
 * vue 页面主入口，用于启动 vue
 * @param {*} pageComponent vue 入口页面（多入口）
 * @param {*} routes 路由列表
 * @param {*} libs 页面依赖的第三方包
 */
const boot = (pageComponent, { routes, libs } = {}) => {
  const app = createApp(pageComponent);

  app.use(ElementPlus);

  app.use(pinia);

  // 不同的页面入口可能依赖不同的第三方包，这里通过传参动态使用
  if (libs && libs.length) {
    libs.forEach((lib) => {
      app.use(lib);
    });
  }

  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    app.use(router);

    // 等路由准备好再挂载（主要在 ssr 场景下需要）
    router.isReady().then(() => {
      app.mount('#root');
    });
  } else {
    app.mount('#root');
  }
};

export default boot;
