var express = require('express');
var router = express.Router();
var Book = require('../models/books')



/* GET home page. */
router.get('/', function (req, res, next) {
    Book.findAll().then(doc => {
        res.render('index', {title: 'All Book: ', mybook: false, items: doc})
    }).catch(err => {
        res.render('index', {title: 'All Book: ', mybook: false, items: []})
    })

});



router.get('/allbooks', function (req, res, next) {
    Book.findAll().then(doc => {
        res.render('index', {title: 'All Book: ', mybook: false, items: doc})
    }).catch(err => {
        res.render('index', {title: 'All Book: ', mybook: false, items: []})
    })
})
module.exports = router;
