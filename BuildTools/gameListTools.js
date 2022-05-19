const fs = require('fs');
const crypto = require('crypto');
const program = require('commander');
const { exit } = require('process');

program
	.version('0.0.1')
	.usage('<spreadsheet-id> <client-script-dir> <client-data-dir> <server-script-dir> <server-data-dir> [options]')
	.option('-jsonDataPath, --jsonDataPath [jsonDataPath]', 'GameInfoPath')
	.option('-gameListPath, --gameListPath [gameListPath]', 'GameListPath')
	.option('-outPath, --outPath [outPath]', 'TempPath')
	.option('-zipPath, --zipPath [zipPath]', 'zipPath')
	.parse(process.argv);

if (program.args.length < 4) {
	program.help();
}

let theGameInfoPath = program.args[0]
let theGameListPath = program.args[1]
let outPath = program.args[2]
let zipPath = program.args[3]

try {
	console.log("read gameInfo");
	let gameInfoCon = fs.readFileSync(theGameInfoPath);
	let theGameInfo = JSON.parse(gameInfoCon.toString());

	console.log("read zipfile")
	let gameInfoFd = fs.openSync(zipPath, 'r');
	theGameInfo.size = Math.ceil(fs.fstatSync(gameInfoFd).size / 1024);

	const buffer = fs.readFileSync(zipPath);
	const hash = crypto.createHash('md5');
	hash.update(buffer, 'utf8');
	const md5 = hash.digest('hex');
	theGameInfo.md5 = md5;

	console.log("write gameinfo")
	fs.writeFileSync(theGameInfoPath, JSON.stringify(theGameInfo));

	console.log("read gameList");
	let gameListCon = fs.readFileSync(theGameListPath);
	let gameList = JSON.parse(gameListCon.toString());

	let has = false;
	for (let i = 0; i < gameList.gameList.length; i++) {
		if ((theGameInfo.id == gameList.gameList[i].id) && (theGameInfo.scheme == gameList.gameList[i].scheme)) {
			gameList.gameList[i] = theGameInfo;
			has = true;
			break;
		}
	}
	if (!has) {
		gameList.gameList.push(theGameInfo);
	}
	console.log("save gamelist")
	fs.writeFileSync(outPath, JSON.stringify(gameList));
} catch (error) {
	console.error(error);
	exit(1)
}