const fs = require('fs')
const through = require('.')
const Koa = require('koa');
const app = new Koa();
// app.use(require('koa-static')('./public'));

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

app.use(require('koa-static')('./public'));

// Listen
app.listen(3000)