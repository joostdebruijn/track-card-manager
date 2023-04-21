'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');

// Creating module instances.
const app = new Koa();
const router = new Router();
const bodyParser = require('koa-bodyparser');
const database = require('./database');

database.getModels.then((models) => {
  app.use(bodyParser({
    onerror: (err, ctx) => {
      ctx.throw(err, 422);
    }
  }));

  app.use(async (ctx, next) => {
    await next();
    ctx.set('Access-Control-Allow-Origin', '*');
  });

  app.models = models;
  const Tracks = app.models.Tracks;

  // Creating routes.

  // Get all tracks.
  router.get('/api/tracks', async (ctx, next) => {
    ctx.body = await Tracks.findAll();
    return next();
  });

  router.options('/api/tracks', async (ctx, next) => {
    ctx.response.set('Access-Control-Allow-Headers', 'content-type');
    ctx.response.status = 200;

    return next();
  });

  // Add a track.
  router.post('/api/tracks', async (ctx, next) => {
    ctx.body = await Tracks.create(ctx.request.body);
    return next();
  });

  // Get a track by id.
  router.get('/api/tracks/:trackId', async (ctx, next) => {
    ctx.body = await Tracks.findByPk(ctx.params.trackId);

    if (!ctx.body) {
      ctx.response.status = 404;
    }

    return next();
  });

  // Get the track that represents the current situation.
  router.get('/api/tracks/current', async (ctx, next) => {
    ctx.body = await Tracks.findByPk();

    if (!ctx.body) {
      ctx.response.status = 404;
    }

    return next();
  });

  app.use(router.routes());
  // app.use(router.allowedMethods());
  app.listen(3000);
  console.log('Server started');
});
