# xrp-redis-walletgen
XRP massive wallet generation with output formatted for mass input into redis

This code is intended to create massive amounts of wallets to import into a redis database to search for vanity strings.

You will need the ripple-keypairs module to be able to use this code
To install this use: `npm install ripple-keypairs`

usage:    `node xrp-redis-walletgen.js <number-of-attempts> <filename>`
example:  `node xrp-redis-walletgen.js 100000 output1`

In Linux you can run this in the background with: `nohup node xrp-redis-walletgen.js 100000 output1 &`
If you want to run this code on multiple threads then you can run it more than once at the same time (with different output files)
If the code is running in background on Linux then you can logout and as long as the computer is running the code will continue to run

NOTE: The file will be created when this .js is run - if it already exists then the code will stop and this message will be displayed
Another example of a filepath causing the code to stop would be incorrect access permissions which will give an error

In redis you may want to disable all data persistence by disabling AOF and RDB snapshotting in the redis.conf file
Disable AOF by setting appendonly to "no"
Disable RDB snapshotting by commenting out all (three by default) of the "save" configurations

To import into redis use: `cat <filename(s)> | redis-cli --pipe`
example: `cat output* | redis-cli --pipe`
You can then search wallets by running redis-cli and using the `keys` command
To remove all data from redis when done you can use the `flushall` command in redis-cli

Ripple wallets are base58 encoded, start with `r` and contain the following characters only:
`123456789 ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz` (`0`, `I`, `O` and `l` are excluded)

Redis: https://redis.io/
Quickstart: https://redis.io/topics/quickstart
