const { isMainThread, workerData, parentPort } = require('worker_threads')
const rk = require('ripple-keypairs')

// Running as a true Worker?: self-execute
if (!isMainThread) {
  worker(workerData)
}

module.exports = worker
function worker({ attempts, batchSize = attempts }) {
  let keys = []
  let wallet = null
  let seed = null
  let keypair = null
  for (let i = 0; i < attempts; i++) {
    // batch results
    if (batchSize && i % batchSize === batchSize - 1) {
      respond(keys, false)
      keys = []
    }
    seed = rk.generateSeed()
    keypair = rk.deriveKeypair(seed)
    wallet = rk.deriveAddress(keypair.publicKey)
    keys.push(
      '*3\r\n$3\r\nSET\r\n$' +
        wallet.length +
        '\r\n' +
        wallet +
        '\r\n$' +
        seed.length +
        '\r\n' +
        seed +
        '\r\n'
    )
  }

  return respond(keys, true)
}

function respond(keys, done) {
  const result = { keys, done }
  if (!isMainThread) {
    parentPort.postMessage(result)
  } else {
    return result
  }
}
