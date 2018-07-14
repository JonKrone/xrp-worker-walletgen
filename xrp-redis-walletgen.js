// XRP massive wallet generation formatted for mass input into redis
//
const attempts	= process.argv[2];
const fs	= require('fs');

var rk		= require('ripple-keypairs');
var usage	= '\nXRP massive wallet generation with output formatted for mass input into redis\n\n'+
		  'usage:    node xrp-redis-walletgen.js <number-of-attempts> <filename>\n'+
		  'example:  node xrp-redis-walletgen.js 100000 output1\n\n'+
		  'In Linux you can run this in the background with: nohup node xrp-redis-walletgen.js 100000 output1 &\n'+
		  'If you want to run this code on multiple threads then you can run it more than once at the same time (with different output files)\n'+
		  'If the code is running in background on Linux then you can logout and as long as the computer is running the code will continue to run\n\n'+
		  'In redis you may want to disable all data persistence by disabling AOF and RDB snapshotting in the redis.conf file\n'+
		  'To import into redis use: cat <filename(s)> | redis-cli --pipe\n'+
		  'example: cat output* | redis-cli --pipe\n'+
		  'You can then search wallets by running redis-cli and using the "keys" command\n'+
		  'To remove all data from redis when done you can use the "flushall" command in redis-cli\n\n'+
		  'NOTE: The file will be created when this .js is run - if it already exists then the code will stop and this message will be displayed\n'+
		  'Another example of a filepath causing the code to stop would be incorrect access permissions which will give an error\n';

if(attempts > 0 && !fs.existsSync(process.argv[3])) {
	const file = fs.createWriteStream(process.argv[3]);
	var wallet = null;
	var seed = null
	var keypair = null
	for(var i = 0; i<attempts; i++){
		seed = rk.generateSeed();
		keypair = rk.deriveKeypair(seed);
		wallet = rk.deriveAddress(keypair.publicKey);
		file.write('*3\r\n$3\r\nSET\r\n$' + wallet.length + '\r\n' + wallet + '\r\n$' + seed.length + '\r\n' + seed + '\r\n');
	}
} else {
	console.log(usage);
}
