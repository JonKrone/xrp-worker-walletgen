"use strict";
// XRP massive wallet generation formatted for mass input into redis
Object.defineProperty(exports, "__esModule", { value: true });
const main_thread_1 = require("./src/main-thread");
const parse_args_1 = require("./src/parse-args");
main_thread_1.main(parse_args_1.parseArgs());
