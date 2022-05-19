const fs = require('fs');
const program = require('commander');
const { exec } = require('child_process');
const path = require('path');

const MaxVersionNum = 10;

program
	.version('0.0.1')
	.usage('<spreadsheet-id> <client-script-dir> <client-data-dir> <server-script-dir> <server-data-dir> [options]')
	.option('-buildPath, --buildPath [buildPath]', 'BuildPath')
	.option('-version, --version [version]', 'Version')
	.option('-outPath, --outPath [outPath]', 'OutPath')
	.parse(process.argv);

if (program.args.length < 3) {
	program.help();
}

let buildPath = program.args[0]
let version = program.args[1]
let outPath = program.args[2]

function removeDir(path) {
    let cmdStr = `rm -rf ${path}`;
    exec(cmdStr, function (err, stdout, srderr) {
        if (err) {
          console.log(srderr);
        } else {
          console.log(stdout);
        }
    });
}

console.log("read buildlist");
let buildListCon = fs.readFileSync(outPath);
let buildListInfo;
if (!buildListCon.toString()) {
    buildListInfo = [];
} else {
    buildListInfo = JSON.parse(buildListCon.toString());
}
let idx = buildListInfo.indexOf(version);
while (-1 !== idx) {
    buildListInfo.splice(idx, 1);
    idx = buildListInfo.indexOf(version);
}
buildListInfo.unshift(version);
while (buildListInfo.length > MaxVersionNum) {
    let v = buildListInfo.pop();
    removeDir(path.join(buildPath, v));
}

console.log("write buildlist")
fs.writeFileSync(outPath, JSON.stringify(buildListInfo));
