const assert = require('assert');
const supertest = require('supertest');
const md5 = require('md5');
const GCodeCore = require('../../core');
const { signKey } = require('../../config/config.default');

const st = Date.now();

describe('project controller test', function () {
  this.timeout(60000);

  let request;

  it('启动服务', async () => {
    const app = await GCodeCore.start();

    request = supertest(app.listen());
  });

  it('GET /api/project/model_list', async () => {
    let tmpRequest = request.get('/api/project/model_list');

    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));

    const res = await tmpRequest;

    assert(res.body.success === true);

    const data = res.body.data;

    assert(data.length > 0);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);

      assert(item.project);
      for (const projKey in item.project) {
        assert(item.project[projKey].key);
        assert(item.project[projKey].name);
      }
    }
  });
});
