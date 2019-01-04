const fs = require('fs')
const http = require('http')
const through = require('.')
const graceful = require('graceful')

const app = http.createServer(function (req, res) {
    through(res)

    if (req.url === '/') {
        res.writeHead(200)
        res.end('hello world\n')
    }

    if (req.url === '/json') {
        res.json({
            a: 1
        })
    }

    if (req.url === '/s') {
        res.stream.add(fs.createReadStream('./package.json'))
        res.stream.add(fs.createReadStream('./index.js'))
        res.end()
    }

    if (req.url === '/d') {
        res.write('hello\n')
        res.write(fs.createReadStream('./package.json'))
        res.write(fs.createReadStream('./index.js'))
        res.write('world\n')
        res.end()
    }

    if (req.url === '/f') {
        res.write(fs.createReadStream('./package.json'))
        res.write(fs.createReadStream('./index.js'))
        res.end()
    }
})

var server = app.listen(8000)

graceful({
    servers: [server],
    killTimeout: '30s',
})