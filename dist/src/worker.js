"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const ripple_keypairs_1 = __importDefault(require("ripple-keypairs"));
// Running as a true Worker?: self-execute
if (!worker_threads_1.isMainThread) {
    genKeys(worker_threads_1.workerData);
}
function genKeys({ attempts, batchSize = attempts, }) {
    let keys = [];
    let wallet = null;
    let seed = null;
    let keypair = null;
    for (let i = 0; i < attempts; i++) {
        // batch results
        if (batchSize && i % batchSize === batchSize - 1) {
            respond(keys, false);
            keys = [];
        }
        seed = ripple_keypairs_1.default.generateSeed();
        keypair = ripple_keypairs_1.default.deriveKeypair(seed);
        wallet = ripple_keypairs_1.default.deriveAddress(keypair.publicKey);
        keys.push('*3\r\n$3\r\nSET\r\n$' +
            wallet.length +
            '\r\n' +
            wallet +
            '\r\n$' +
            seed.length +
            '\r\n' +
            seed +
            '\r\n');
    }
    return respond(keys, true);
}
exports.genKeys = genKeys;
function respond(keys, done) {
    const result = { keys, done };
    if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
        worker_threads_1.parentPort.postMessage(result);
    }
    return result;
}
