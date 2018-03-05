const fs = require('fs')
module.exports = function() {
    const data = {};
    return {
        set: (key, value) => {
            data[key] = clone(value);
            return Promise.resolve();
        },
        get: (key) => {
            return Promise.resolve(clone(data[key]));
        },
        unset: (key) => {
            console.log('unset', key)
            delete data[key];
            return Promise.resolve();
        },
        save: () => {
            return new Promise(function(resolve, reject) {
                fs.writeFile('./db.json', JSON.stringify(data, null, '    '), function(err) {
                    if (err) return reject(err);
                    resolve()
                });
            });
        }
    }
}

function clone(data) {
    if (data === undefined) return;
    return JSON.parse(JSON.stringify(data));
}