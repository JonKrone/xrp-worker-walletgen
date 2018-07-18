const fs = require('fs')

module.exports = async function main({ out, cpus, attempts, noWorkers }) {
  const file = fs.createWriteStream(out)

  console.time('Time spent')

  if (noWorkers) {
    // have one worker perform all attempts
    const { keys } = require('./worker')({ attempts })
    console.log('Output:', out)
    console.timeEnd('Time spent')
    return await file.write(keys.join(''))
  }
  // else divvy the work among separate workers

  const { Worker } = require('worker_threads')
  let workers = []
  for (let i = 0; i < cpus; i++) {
    workers.push(
      new Worker('./worker.js', {
        workerData: {
          attempts: Math.ceil(attempts / cpus),
          batchSize: Number.POSITIVE_INFINITY,
        },
      })
    )
  }

  let numDone = 0
  workers.forEach(worker => {
    worker.on('message', message => {
      const { keys, done } = message
      if (done) {
        numDone++
        worker.unref()
      }

      file.write(keys.join(''))

      if (numDone >= cpus) {
        console.log('Output:', out)
        console.timeEnd('Time spent')
      }
    })

    worker.on('error', (...args) => {
      numDone++
      console.error('worker error:', ...args)
    })
    worker.on('exit', () => {})
  })
}
