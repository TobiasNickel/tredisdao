//var store = require('./db')()
var redismock = require('redis-mock')
var redis = promisifyAll(redismock.createClient({}));
var db = require('./index')({ redis: redis, idName: '_id' });
var userdao = db.prepareDao({
    collectionName: 'users',
    schema: {
        name: 'string',
        mail: 'string',
    },
    indexes: {
        name: true,
        mail: true
    },
});

;
(async function() {
    await userdao.insert({ name: 'tobias', mail: 'business@tnickel.de' });
    var tobias = await userdao.getByName('tobias');
    console.log(tobias);

    //await userdao.remove(tobias[0]._id);
    await db.store.save();
})().catch(err => console.log(err))

var wait = function(ms) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve(ms + 'ms'), ms)
    });
}

var utils = require('utils')

function promisifyApp(obj) {
    Object.keys(obj).forEach(function(prop) {
        if (typeof(obj[prop]) === 'function') {
            obj[prop] = utils.promisify(obj[prop]);
        }
    });
}