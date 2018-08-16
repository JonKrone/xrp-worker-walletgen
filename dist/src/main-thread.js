"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const worker_threads_1 = require("worker_threads");
const worker_1 = require("./worker");
async function main({ out, cpus, attempts, noWorkers }) {
    const file = fs_1.createWriteStream(out);
    // have one worker perform all attempts
    if (noWorkers) {
        const { keys } = worker_1.genKeys({ attempts });
        console.log(attempts, 'keys written to file:', out);
        return await file.write(keys.join(''));
    }
    // else divvy the work among separate workers
    let workers = [];
    for (let i = 0; i < cpus; i++) {
        workers.push(new worker_threads_1.Worker('./dist/src/worker.js', {
            workerData: {
                attempts: Math.ceil(attempts / cpus),
                batchSize: Number.POSITIVE_INFINITY,
            },
        }));
    }
    let numDone = 0;
    workers.forEach(worker => {
        worker.on('message', (message) => {
            const { keys, done } = message;
            if (done) {
                numDone++;
                worker.unref();
            }
            file.write(keys.join(''));
            if (numDone >= cpus) {
                // done!
                console.log('Written to file:', out);
            }
        });
        worker.on('error', (err) => {
            numDone++;
            console.error('worker error:', err);
        });
        worker.on('exit', () => { });
    });
}
exports.main = main;
