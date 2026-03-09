import boot from '@src/boot';
import Dashboard from './dashboard.vue';

// 头部菜单路由 + 侧边栏菜单路由（头部路由的子路由）
const routes = [
  {
    path: '/iframe',
    component: () => import('./component/iframe-view/iframe-view.vue'),
  },
  {
    path: '/schema',
    component: () => import('./component/schema-view/schema-view.vue'),
  },
  {
    path: '/todo',
    component: () => import('./todo/todo.vue'),
  },
  // 侧边栏
  {
    path: '/sider',
    component: () => import('./component/sider-view/sider-view.vue'),
    children: [
      {
        path: '/iframe',
        component: () => import('./component/iframe-view/iframe-view.vue'),
      },
      {
        path: '/schema',
        component: () => import('./component/schema-view/schema-view.vue'),
      },
      {
        path: '/todo',
        component: () => import('./todo/todo.vue'),
      },
    ],
  },
  // 兜底，当是 /sider/xxx 等其他路由时
  {
    path: '/sider/:chapters+',
    component: () => import('./component/sider-view/sider-view.vue'),
  },
];

boot(Dashboard, { routes });
