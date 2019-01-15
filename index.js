const debug = require('debug')('http-extra')
const isStream = require('is-stream')

function isStreamEnded(stream) {
  var ended;

  if (typeof stream.ended !== 'undefined') {
    ended = stream.ended;
  } else {
    ended = stream._readableState.ended;
  }

  return Boolean(ended).valueOf();
}

module.exports = function (res) {
  const { Readable, Writable } = require('stream')
  var stream = new Readable({
    read() { }
  })
  let writeStreamable = false
  stream.i = 0

  stream.on('data', (data) => {
    debug('<-')
    res.write(data)
  })

  stream.add = function (s) {
    if (false === isStream(s)) return
    writeStreamable = true
    var that = this
    this.i++

    s.on('data', function (chunk) {
      debug('data')
      stream.push(chunk)
    })

    s.on('end', function () {
      that.i--
      debug('stream on end i=' + that.i)

      if (that.i === 0) {
        stream.emit('end')
      }
    })
  }
  // 解决：如果stream先end，然后res.end
  stream.on('end', function () {
    debug('stream.end() before res.end')
    writeStreamable = false
  })

  res._end = res.end
  res.end = function () {
    let that = this
    debug('writeStreamable =' + writeStreamable)
    if (writeStreamable === false){
      return res._end.apply(that, arguments)
    }

    stream.on('end', function () {
      debug('res.end() trigger stream end')
      // res.end()
      res._end.apply(that, arguments)
    })
  }
  
  res.__write = res.write
  res.write = function () {
    var i = arguments[0]

    if (true == isStream(i)) {
      debug('write a stream')
      this.stream.add(i)
    } else {
      res.__write.apply(this, arguments)
    }
  }

  res.stream = stream
}
