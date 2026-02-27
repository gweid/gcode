# gcode.js

一个企业级全栈应用框架


## model

通过一个个 model 配置去生成项目（model ---> DSL ---> 项目）。基于领域模型设计。例子：

```js
{
  mode: 'dashboard', // 模板类型，不同模板类型对应不一样的模板数据结构
  name: '', // 名称
  desc: '', // 描述
  icon: '', // 图标
  homePage: '', // 首页（项目配置）
  // 头部菜单
  menu: [
    {
      key: '',
      name: '',
      menuType: '', // group | module
      // menuType 是 group 的时候，有子菜单
      subMunu: [
        {}
      ],
      // 当 menuType == module 时，可填
      moduleType: '', // sider | iframe | custom | schema
      // 当 moduleType === sider 时
      siderConfig: {
        menu: [
          {} // 可递归 menuItem（里面不能再配置 moduleType === sider）
        ]
      },
      // 当 moduleType === iframe 时
      iframeConfig: {
        path: '', // iframe 路径
      },
      // 当 moduleType === custom 时
      customConfig: {
        path: '', // 自定义路由路径
      },
      // 当 moduleType === schema 时
      schemaConfig: {
        api: '', // 数据源API （遵循 RESTFUL 规范）
        schema: { // 板块数据结构，遵循 schema 规范
          type: 'object',
          properties: {
            key: {
              // 标准 JSON Schema 规范
              type: '', // 字段类型
              label: '', // 字段中文名
            }
          }
        },
        tableConfig: {}, // table 相关配置
        searchConfig: {}, // search-bar 相关配置
        components: {}, // 模块组件
      },
    }
  ]
};
```