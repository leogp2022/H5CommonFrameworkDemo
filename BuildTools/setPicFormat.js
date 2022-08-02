const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const program = require('commander');
const jetpack = require('fs-jetpack');

program
	.version('0.0.1')
	.usage('<quality> <metaPaths> <matchings> [options]')
	.option('-quality, --quality [quality]', 'Quality')
	.option('-findPath, --findPath [findPath]', 'FindPath')
	.option('-matchings, --matchings [matchings]', 'Matchings')
	.option('-del, --del [del]', 'Del')
	.parse(process.argv);

if (program.args.length < 3) {
	program.help();
}

let quality = parseInt(program.args[0]);
let findPath = program.args[1];
let matchings = program.args[2];
let del = program.args[3];
let formatName = "webp";

// console.log("findPath:", findPath);
// console.log("matchings:", matchings);

if (isNaN(quality)) {
    console.error("error: quality is NaN.");
    exit(1);
}

let matching = [];
if (matchings) {
    matching = matchings.split(",");
}

// console.log("matching:", matching);
console.log("find start:", Date.now());
let metaPathArr = jetpack.find(findPath, { matching });
console.log("find end:", Date.now());
console.log("file length:", metaPathArr.length);
let metaPath;
for (let i = 0; i < metaPathArr.length; i++) {
    metaPath = metaPathArr[i];
    // console.log("metaPath:", metaPath);
    let metaCon = fs.readFileSync(metaPath);
    let metaJson = JSON.parse(metaCon.toString());
    let platformSettings = metaJson.platformSettings;
    if (platformSettings) {
        let defaultCfg = platformSettings.default;
        if (!defaultCfg) {
            defaultCfg = platformSettings.default = {};
        }
        let formats = defaultCfg.formats;
        if (!formats) {
            formats = defaultCfg.formats = [];
        }
        let hasFormat = false;
        let format;
        let i = 0;
        for (; i < formats.length; i++) {
            format = formats[i];
            if (format.name === formatName) {
                hasFormat = true;
                break;
            }
        }
        let isChg = false;
        if (del) {
            if (hasFormat) {
                formats.splice(i, 1);
                isChg = true;
            }
        } else {
            if (!hasFormat) {
                formats.push({
                    "name": formatName,
                    "quality": quality
                });
                isChg = true;
            } else {
                if (format.quality !== quality) {
                    format.quality = quality;
                    isChg = true;
                }
            }
        }
        if (isChg) {
            fs.writeFileSync(metaPath, JSON.stringify(metaJson, null, "  "));
        }
    }
}
