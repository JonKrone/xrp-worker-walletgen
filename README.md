# xrp-redis-walletgen

XRP massive wallet generation with output formatted for mass input into redis

This code is intended to create massive amounts of wallets to import into a redis database to search for vanity strings.

## Install

```shell
$ git clone https://github.com/Xendipity/xrp-redis-walletgen
$ cd xrp-redis-walletgen
$ npm i
```

## Usage

`node . <number-of-attempts> [options]`

In Linux you can run this in the background with: `nohup node . 100000 &`

If the code is running in background on Linux then you can logout and as long as the computer is running the code will continue to run

## Options

`--out=<filename></filename>` Specifies the output filename. Don't provide to have it auto-generate

`--no-workers` Don't use multiple threads

`--cpus=<number>` Number of CPU cores to use

## Redis Usage

To import into redis use: `cat <filename(s)> | redis-cli --pipe`

In redis you may want to disable all data persistence by disabling AOF and RDB snapshotting in the redis.conf file

Disable AOF by setting `appendonly` to `"no"`
Disable RDB snapshotting by commenting out all (three by default) of the `"save"` configurations

You can then search wallets by running redis-cli and using the `keys` command

To remove all data from redis when done you can use the `flushall` command in redis-cli

## Notes

Ripple wallets are base58 encoded, start with `r` and contain the following characters only:

`123456789 ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz` (`0`, `I`, `O` and `l` are excluded)

> Redis: https://redis.io/

> Quickstart: https://redis.io/topics/quickstart
