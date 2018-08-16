"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const numCPUs = os_1.cpus().length;
function parseArgs() {
    const args = process.argv.slice(2);
    const noWorkers = args.includes('--no-workers');
    const attempts = parseInt(args[0], 10);
    if (Number.isNaN(attempts)) {
        console.log(USAGE);
        throw new Error('The first argument must be the number of attempts');
    }
    const cpuArg = args.find(arg => arg.includes('--cpus'));
    const cpus = cpuArg ? parseInt(cpuArg.split('=')[1], 10) : numCPUs;
    if (cpus > numCPUs) {
        console.log(USAGE);
        throw new Error(`You've specified more CPUs than are available. You have ${numCPUs}`);
    }
    const outArg = args.find(arg => arg.includes('--out'));
    let out;
    if (outArg) {
        out = outArg.split('=')[1];
    }
    else {
        // use a generated filename
        out = path_1.join('out', `keys-${String(Math.random()).slice(2, 7)}`);
    }
    if (fs_1.existsSync(out)) {
        throw new Error('Output path already exists');
    }
    return {
        out,
        attempts,
        noWorkers,
        cpus,
    };
}
exports.parseArgs = parseArgs;
const USAGE = '\nXRP massive wallet generation with output formatted for mass input into redis\n\n' +
    'usage:    node xrp-redis-walletgen.js <number-of-attempts> [options]\n' +
    'example:  node xrp-redis-walletgen.js 100000\n\n' +
    'options:\n' +
    '--out:\tFile to redirect output to. Generated if not specified' +
    '--no-workers:\tUse a single thread' +
    '--cpus:\tNumber of CPUs to use' +
    'In Linux you can run this in the background with: nohup node . 100000 &\n' +
    'If the code is running in background on Linux then you can logout and as long as the computer is running the code will continue to run\n\n' +
    'In redis you may want to disable all data persistence by disabling AOF and RDB snapshotting in the redis.conf file\n' +
    'To import into redis use: cat <filename(s)> | redis-cli --pipe\n' +
    'example: cat keys* | redis-cli --pipe\n' +
    'You can then search wallets by running redis-cli and using the "keys" command\n' +
    'To remove all data from redis when done you can use the "flushall" command in redis-cli\n\n' +
    'Another example of a filepath causing the code to stop would be incorrect access permissions which will give an error\n';
