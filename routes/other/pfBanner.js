const Router = require('koa-router');
const router = new Router();
const {accessSync} = require('fs');
const path = require('path');

router
  .get('/', async (ctx, next) => {
    ctx.throw(501, 'a uid is required.');
    await next()
  })
  .get('/:uid', async (ctx, next) => {
    const {uid} = ctx.params;
    try {
      const url = path.resolve(__dirname, `../../resources/pf_banners/${uid}.jpg`);
      accessSync(url);
      ctx.filePath = url;
    } catch(e) {
      ctx.filePath = path.resolve(__dirname, '../../resources/default_things/default_pf_banner.jpg')
    }
    await next()
  });

module.exports = router;