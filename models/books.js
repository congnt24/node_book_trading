/**
 * Created by apple on 7/6/17.
 */
var BaseModel = require('./basemodel')

const BookModel = BaseModel.createObject('book')

var repo = {}

var book = {
    TITLE: '',
    IMAGE: '',
    OWNER: '',
    STATE: 0,
    TO: '',
    CREATE_DATE: new Date()
}


repo.insert = (owner, title, img) => {
    let item = Object.assign({}, book)
    item.OWNER = owner
    item.TITLE = title
    item.IMAGE = img
    return BookModel.insert(item)
}

repo.findAll = () => BookModel.find({})

repo.findByUser = (user) => BookModel.find({OWNER: user})

repo.findByRequestForYou = (user) => BookModel.find({OWNER: user, STATE: 1})

repo.findByYourRequest = (user) => BookModel.find({TO: user, STATE: 1})

repo.createRequest = (user, book_id) => BookModel.findOneAndUpdate({_id: BookModel.getObjectId(book_id), OWNER: {$ne: user}}, {$set: {STATE: 1, TO: user}})

repo.cancelRequest = (book_id) => BookModel.findOneAndUpdate({_id: BookModel.getObjectId(book_id)}, {$set: {STATE: 0, TO: ''}})

// repo.acceptRequest = (book_id) => BookModel.findOneAndUpdate({_id: BookModel.getObjectId(book_id)}, {$set: {STATE: 2, OWNER: TO}})

repo.acceptRequest = (book_id) => BookModel.findOne({_id: BookModel.getObjectId(book_id)}).then(doc => BookModel.update({_id: BookModel.getObjectId(book_id)}, {$set: {STATE: 0, OWNER: doc.TO, TO: ''}}))

repo.denyRequest = (book_id) => BookModel.findOneAndUpdate({_id: BookModel.getObjectId(book_id)}, {$set: {STATE: 0, TO: ''}})

module.exports = repo