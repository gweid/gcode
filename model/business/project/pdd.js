module.exports = {
  name: '拼多多',
  desc: '拼多多电商系统',
  homePage: '/todo?proj_key=pdd&key=product',
  menu: [
    {
      key: 'client',
      name: '客户管理（拼多多）',
    },
    {
      key: 'data',
      name: '数据分析',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'analysis',
            name: '电商罗盘',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'sider-search',
            name: '信息查询',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
              path: 'https://www.baidu.com',
            },
          },
          {
            key: 'categories',
            name: '分类数据',
            menuType: 'group',
            subMenu: [
              {
                key: 'category-1',
                name: '一级分类',
                menuType: 'module',
                moduleType: 'custom',
                customConfig: {
                  path: '/todo',
                },
              },
              {
                key: 'category-2',
                name: '二级分类',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                  path: 'https://www.baidu.com',
                },
              },
            ],
          },
        ],
      },
    },
    {
      key: 'shop-setting',
      name: '店铺设置',
      menuType: 'group',
      subMenu: [
        {
          key: 'info-setting',
          name: '店铺信息',
          menuType: 'module',
          moduleType: 'custom',
          customConfig: {
            path: '/todo',
          },
        },
        {
          key: 'quality-setting',
          name: '店铺资质',
          menuType: 'module',
          moduleType: 'iframe',
          customConfig: {
            path: 'https://www.baidu.com',
          },
        },
        {
          key: 'categories',
          name: '分类数据',
          menuType: ' group',
          subMenu: [
            {
              key: 'category-1',
              name: '一级分类',
              menuType: 'module',
              moduleType: 'custom',
              customConfig: {
                path: '/todo',
              },
            },
            {
              key: 'category-2',
              name: '二级分类',
              menuType: 'module',
              moduleType: 'iframe',
              iframeConfig: {
                path: 'https://www.baidu.com',
              },
            },
          ],
        },
      ],
    },
  ],
};
