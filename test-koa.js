const fs = require('fs')
const http = require('http')
const Koa = require('koa');
const graceful = require('graceful')
const app = new Koa();
const through = require('.')
// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
    const res = ctx.res
    through(res)
    
    if(ctx.path === '/'){
        res.write('hello\n')
        res.end()
    }else{
        res.write('hello\n')
        res.write(fs.createReadStream('./package.json'))
        res.write(fs.createReadStream('./index.js'))
        res.write('world\n')
        res.end()
    }
});

var server = app.listen(3000)

graceful({
    servers: [server],
    killTimeout: '30s',
})