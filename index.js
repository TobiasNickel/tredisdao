const monk = require('monk');
const superstruct = require("superstruct");
const tpicker = require("tpicker");
const tcacher = require('tcacher');


module.exports = function db(config) {
    if (!config.redis) throw new Error('required redis connection at config.redis');
    var defaultIdPropName = config.idPropName || '_id';
    const db = {
        daos: config.registry || {},
        defaultPageSize: config.pageSize || 20,
        redis: config.redis,
        defaultIdProp: config.idProp || '_id',
        prepareDao: function(dao) {
            db.daos[dao.collectionName] = dao;
            return prepareDAO(dao, db);
        }
    };
    return db;
}

function prepareDAO(dao, db) {
    if (dao.picker)
        throw new Error('dao already has picker');
    if (dao.verifySchema)
        throw new Error('dao already has verifySchema');
    if (dao.db)
        throw new Error('dao already has db');
    var collectionName = dao.collectionName;
    dao.prefix = collectionName + '_'
    dao.db = db;
    var verifySchema = superstruct.struct(dao.schema, dao.defaults || {});
    var picker = tpicker.createPicker(dao.schema);
    dao.picker = picker;
    dao.verifySchema = verifySchema;
    dao.idProp = dao.idProp || db.defaultIdProp
    dao.schema[dao.idProp] = 'string?';
    dao.indexes = dao.indexes || {};
    dao.indexes[dao.idProp] = true;
    dao.redis = dao.redis || db.redis

    dao.insert = function(obj) {
        if (!obj[dao.idProp]) obj[dao.idProp] = randomId();
        return dao.redis.set(dao.prefix + obj[dao.idProp], JSON.stringify(obj));
    }
    dao.remove = function(obj) {

    }
    dao.save = function() {

    }

    return dao;
}


function groupBy(collection, propname) {
    var result = {};
    collection.forEach(item => {
        if (!result[item[propname]]) result[item[propname]] = [];
        result[item[propname]].push(item);
    })
    return result;
}

function toArray(item) {
    if (Array.isArray(item)) return item;
    return [item]
}

var randomId = () => parseInt(Math.random() * 1000000000) + '' + parseInt(Math.random() * 1000000000);