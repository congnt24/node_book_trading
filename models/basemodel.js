/**
 * Created by apple on 7/6/17.
 */
var db = require('../db')
var ObjectID = require('mongodb').ObjectID

/**
 * A base model for interacting with mongo db
 * How to use this:
 * ex: When you need a object to interact with USER collection
 * 1. Add "var Base = require('./basemodel')" in user.js file
 * 2. create User model by: var user = Base.createObject('collection_name')
 * 3. Use this in your code: user.findOne(...)
 */
const model = {
    error(err){
        return new Promise((resolve, reject) => {
            reject(err)
        })
    },
    success(data){
        return new Promise((resolve, reject) => {
            resolve(data)
        })
    },

    col(){
        return db.collection(this.collection)
    },
    findOne(filter, projection) {
        return this.col().then(col => col.findOne(filter, projection))
    },

    find(filter, projection) {
        return this.col().then(col => col.find(filter, projection).toArray())
    },

    insert(datas) {
        return this.col().then(col => col.insert(datas))
    },

    insertIfNotExist(filter, data) {
        return this.findOne(filter).then(doc => {
            if (doc == null) {
                return this.insert(data)
            }
            return this.success('Success')
        }, err => this.error(err))
    },

    removeOne(filter) {
        return this.col().then(col => col.remove(filter, {justOne: true}))
    },

    deleteOne(filter) {
        return this.col().then(col => col.deleteOne(filter))
    },

    deleteMany(filter) {
        return this.col().then(col => col.deleteMany(filter))
    },

    update(filter, data, options){
        return this.col().then(col => col.update(filter, data, options ? options : {upsert: false, multi: true}))
    },

    findOneAndDelete(filter, options){
        return this.col().then(col => col.findOneAndDelete(filter, options))
    },

    findOneAndUpdate(filter, data, options){
        return this.col().then(col => col.findOneAndUpdate(filter, data, options))
    },

    findOneAndReplace(filter, data, options){
        return this.col().then(col => col.findOneAndReplace(filter, data, options))
    },

    getObjectId(_id){
        return new ObjectID(_id)
    }
}

//Create object that interact with a collection by passing collection name
model.createObject = (collection) => {
    return Object.assign({}, model, {collection})
}

module.exports = model