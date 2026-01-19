module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染页面
     * @param {*} ctx 上下文
     */
    async render(ctx) {
      // 在 koaNunjucks 初始化时，设置了模板目录为 app/public，所以这里不用加路径前缀
      // koaNunjucks 初始化时，ctx 上就注入了 render 方法
      // 为什么自定义 loader 可以在 controller 之后注册？
      //  因为只有请求页面访问时才会执行到这里，此时已经完成了所有中间件的注册
      await ctx.render(`output/entry.${ctx.params.page}`);
    }
  };
};
