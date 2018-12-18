var fs = require('fs');
var http = require('http');
// var http = require('./response')

var through = require('.')

var server = http.createServer(function (req, res) {
    through(res)

    // var res = Object.create(response)
    if (req.url === '/') {
        res.writeHead(200);
        res.end('hello world\n');
    }

    if (req.url === '/json') {
        res.json({
            a: 1
        });
    }

    if (req.url === '/s') {
        // res.stream(fs.createReadStream('./index.js'));
        // res.stream(fs.createReadStream('./package.json'));
        var that = res

        res.stream.add(fs.createReadStream('./package.json'));

        res.stream.add(fs.createReadStream('./index.js'))
        
        res.end();
    }

    if (req.url === '/d') {
        res.write(fs.createReadStream('./package.json'));

        res.write(fs.createReadStream('./index.js'))
        
        res.end();
    }
})

server.listen(8000);