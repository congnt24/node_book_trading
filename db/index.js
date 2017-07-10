/**
 * Created by apple on 7/1/17.
 */

"use strict";
var mongodb = require('mongodb').MongoClient
var config = require('../configs/config')


var state = {
    db: null
}

exports.get = () => {
    if (state.db) {
        return new Promise((resolve, reject) => {
            resolve(state.db)
        })
    }
    return new Promise((resolve, reject) => {
        mongodb.connect(config.mongo.url, (err, db) => {
            if (err) {
                reject(err)
            } else {
                console.log('DB connection successful');
                state.db = db
                resolve(db)
            }
        })
    })
}

exports.collection = (collection) => {
    return exports.get().then(db => db.collection(collection))
}

exports.close = done => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null
            done(err, result)
        })
    }
}