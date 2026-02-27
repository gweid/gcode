const path = require('path');
const glob = require('glob');
const _ = require('lodash');

const { sep } = path;

// project 继承 model 的数据结构，project 可以覆盖 model 的同名字段
const projectExtendModel = (model = {}, project = {}) => {
  // 实现 project 继承 model 的数据结构
  return _.mergeWith({}, model, project, (modelValue, projValue) => {
    // 处理数组合并的特殊情况
    if (Array.isArray(modelValue) && Array.isArray(projValue)) {
      let result = [];

      // 因为 project 继承 model，所以需要处理修改和新增内容的情况
      // project有的键值，model也有 => 修改（重载）
      // project有的键值，model没有 => 新增（拓展）
      // model有的键值，project没有 => 保留（继承）

      // 处理修改（重载）和 保留（继承）的情况
      for (let i = 0; i < modelValue.length; i++) {
        const modelItem = modelValue[i];
        const projItem = projValue.find((item) => item.key === modelItem.key);

        // project有的键值，model也有，则递归调用 projectExtendModel 方法覆盖修改，否则保留 model 的值
        result.push(projItem ? projectExtendModel(modelItem, projItem) : modelItem);
      }

      // 处理新增（拓展）的情况
      for (let i = 0; i < projValue.length; i++) {
        const projItem = projValue[i];
        const modelItem = modelValue.find((item) => item.key === projItem.key);

        // project 有的键值，model 没有，则直接添加到结果数组中
        if (!modelItem) {
          result.push(projItem);
        }
      }

      return result;
    }
  });
};

/**
 * 解释 model 配置，并返回继承后的数据结构
 * [
 *   {
 *     modelKey: ${model},
 *     project: {
 *       proj1Key: ${proj1},
 *       proj2Key: ${proj2},
 *     }
 *   }
 * ]
 * @param {*} app
 */
module.exports = (app) => {
  const moduleList = [];

  const modulePath = path.resolve(app.basePath, 'model');

  const fileList = glob.sync(`${modulePath}${sep}**${sep}*.js`);

  fileList.forEach((file) => {
    if (file.includes('index.js')) return;

    // console.log(file);
    const type = file.includes('project') ? 'project' : 'model';

    if (type === 'project') {
      // gcode/model/business/project/pdd.js
      // gcode/model/course/project/bilibili.js
      const modelKey = file.match(/\/model\/(.+?)\/project\//)[1];
      const projKey = file.match(/\/project\/(.+?)\.js/)[1];

      const modelItem = moduleList.find((item) => item.model?.key === modelKey);

      if (!modelItem) {
        modelItem = {};
        moduleList.push(modelItem);
      }

      if (!modelItem.project) {
        modelItem.project = {};
      }

      modelItem.project[projKey] = require(path.resolve(file));
      modelItem.project[projKey].key = projKey;
    }

    if (type === 'model') {
      // gcode/model/business/model.js
      // gcode/model/course/model.js
      // 匹配出 business 和 course
      const modelKey = file.match(/\/model\/(.+?)\/model\.js/)[1];
      let modelItem = moduleList.find((item) => item.model?.key === modelKey);
      if (!modelItem) {
        modelItem = {};
        moduleList.push(modelItem);
      }
      modelItem.model = require(path.resolve(file));
      modelItem.model.key = modelKey;
    }
  });

  // 整理数据：project 需要继承 model 的数据结构
  moduleList.forEach((item) => {
    const { model = {}, project = {} } = item || {};

    Object.keys(project).forEach((projKey) => {
      project[projKey] = projectExtendModel(model, project[projKey]);
    });
  });

  return moduleList;
};
