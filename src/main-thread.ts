import { createWriteStream } from 'fs'
import { Worker } from 'worker_threads'
import { genKeys, GenKeyResult } from './worker'
import { CliArgs } from './parse-args'

export async function main({ out, cpus, attempts, noWorkers }: CliArgs) {
  const file = createWriteStream(out)

  // have one worker perform all attempts
  if (noWorkers) {
    const { keys } = genKeys({ attempts })
    console.log(attempts, 'keys written to file:', out)
    return await file.write(keys.join(''))
  }
  // else divvy the work among separate workers

  let workers = []
  for (let i = 0; i < cpus; i++) {
    workers.push(
      new Worker('./src/worker.js', {
        workerData: {
          attempts: Math.ceil(attempts / cpus),
          batchSize: Number.POSITIVE_INFINITY,
        },
      })
    )
  }

  let numDone = 0
  workers.forEach(worker => {
    worker.on('message', (message: GenKeyResult) => {
      const { keys, done } = message
      if (done) {
        numDone++
        worker.unref()
      }

      file.write(keys.join(''))

      if (numDone >= cpus) {
        // done!
        console.log('Written to file:', out)
      }
    })

    worker.on('error', (err: Error) => {
      numDone++
      console.error('worker error:', err)
    })
    worker.on('exit', () => {})
  })
}
