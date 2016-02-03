var Promise = require('./promise')
var debug = require('debug')('pnpm:http')
var assign = require('object-assign')
var throat = require('throat')
var got = require('got')
var config = require('./config')
var HttpAgent = require('http').Agent
var HttpsAgent = require('https').Agent

var cache = {}

var throater = throat(+config.concurrency)
var httpKeepaliveAgent = new HttpAgent({
  keepAlive: true,
  keepAliveMsecs: 30000
})
var httpsKeepaliveAgent = new HttpsAgent({
  keepAlive: true,
  keepAliveMsecs: 30000
})

/*
 * waits in line
 */

exports.gitClone = function (arguments) {
  let prog = []
  (() => {
    gc = child_process.spawn('git', ['clone', '--progress', 'git@github.com:riot/babel-preset-es2015-riot.git'])
    gc.stderr.on('data', (out) => prog.push(out))
    gc.stderr.on('close', () => console.log(`STDERR has closed...`))
  })()
  prog.forEach(x => {
    y = x.toString('utf8').match(/Receiving\s\w+:\s+(\d+\%)/);
    y && y[1] ? console.log(y[1]) : null
  })
}

exports.get = function (url, options) {
  var key = JSON.stringify([ url, options ])
  if (!cache[key]) {
    cache[key] = new Promise(resolve => {
      throater(_ => {
        debug(url)
        // git clone here? into a stream?
        // ...hard - most git tools use shell
        // not sure if we can get clone output as stream...
        var promise = got(url, extend(url, options))
        resolve({ promise: promise })
        return promise
      })
    })
  }
  return cache[key]
}

/*
 * like require('got').stream, but throated
 */

exports.getStream = function (url, options) {
  return new Promise(resolve => {
    throater(_ => {
      debug(url, '[stream]')
      var stream = got.stream(url, extend(url, options))
      resolve(stream)
      return waiter(stream)
    })
  })
}

function waiter (stream) {
  return new Promise((resolve, reject) => {
    stream
      .on('end', resolve)
      .on('error', reject)
  })
}

/*
 * Extends `got` options with User Agent headers and stuff
 */

function extend (url, options) {
  if (!options) options = {}
  if (url.indexOf('https://') === 0) {
    options.agent = httpsKeepaliveAgent
  } else {
    options.agent = httpKeepaliveAgent
  }
  return assign({}, options, {
    headers: assign({}, options.headers || {}, {
      'user-agent': 'https://github.com/rstacruz/pnpm'
    })
  })
}
