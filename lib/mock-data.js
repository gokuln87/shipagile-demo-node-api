const fs = require('fs');
const path = require('path');

let helper = {};

helper.baseDir = path.join(__dirname, '/../../assets/');

helper.read = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(helper.baseDir + file + '.json', 'utf8', (err, data) => {
            if (!err && data) {
                resolve(JSON.parse(data));
            } else {
                reject(err);
            }
        });
    });

}

module.exports = helper;