import { isMainThread, workerData, parentPort } from 'worker_threads'
import rk from 'ripple-keypairs'

// Running as a true Worker?: self-execute
if (!isMainThread) {
  genKeys(workerData)
}

export interface GenKeyArgs {
  attempts: number
  batchSize?: number
}

export interface GenKeyResult {
  keys: string[]
  done: boolean
}

export function genKeys({
  attempts,
  batchSize = attempts,
}: GenKeyArgs): GenKeyResult {
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

function respond(keys: string[], done: boolean): GenKeyResult {
  const result = { keys, done }
  if (!isMainThread && parentPort) {
    parentPort.postMessage(result)
  }
  return result
}
