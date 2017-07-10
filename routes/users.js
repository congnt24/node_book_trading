/**
 * Created by apple on 6/29/17.
 */

"use strict";
var express = require('express')
var Twitter = require('node-twitter-api'), config = require("../configs/config");
var User = require('../models/user')
var Book = require('../models/books')


var router = express.Router()

//setup twitter
var twitter = new Twitter({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callback: config.twitter.callbackUrl
});


router.get('/', function (req, res, next) {
    //get all book by user
    if (req.session.user) {
        Book.findByUser(req.session.user).then(doc => {
            console.log(doc)
            res.render('index', {title: 'My Book: ', mybook: true, items: doc})
        }).catch(err => {
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

router.get('/addbook', function (req, res, next) {
    if (req.session.user && req.query.title && req.query.img) {
        Book.insert(req.session.user, req.query.title, req.query.img).then(doc => {
            console.log(doc)
            res.end(JSON.stringify(JSON.parse('{"status": "success"}')))
        }).catch(err => {
            console.error(err)
            res.end(JSON.stringify(JSON.parse('{"status": "error"}')))
        })
    } else {
        res.end(JSON.stringify(JSON.parse('{"status": "error"}')))
    }
})

router.get('/yourrequest', function (req, res, next) {
    if (req.session.user) {
        Book.findByYourRequest(req.session.user).then(arr => {
            res.end(JSON.stringify(arr))
        }).catch(err => {
            res.sendStatus(401)
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.sendStatus(501)
        res.end(JSON.stringify('{"status":"error"}'))
    }
})

router.get('/requestforyou', function (req, res, next) {
    if (req.session.user) {
        Book.findByRequestForYou(req.session.user).then(arr => {
            res.end(JSON.stringify(arr))
        }).catch(err => {
            res.sendStatus(401)
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.sendStatus(501)
        res.end(JSON.stringify('{"status":"error"}'))
    }
})


router.get('/request', function (req, res, next) {
    if (req.session.user && req.query.id) {
        Book.createRequest(req.session.user, req.query.id).then(doc => {
            res.end(JSON.stringify(doc))
        }).catch(err => {
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.end(JSON.stringify('{"status":"unauthenticated"}'))
    }
})

router.get('/cancelRequest', function (req, res, next) {
    if (req.query.id) {
        Book.cancelRequest(req.query.id).then(doc => {
            res.end(JSON.stringify(doc))
        }).catch(err => {
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.end(JSON.stringify('{"status":"unauthenticated"}'))
    }
})

router.get('/acceptRequest', function (req, res, next) {
    if (req.query.id) {
        Book.acceptRequest(req.query.id).then(doc => {
            res.end(JSON.stringify(doc))
        }).catch(err => {
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.end(JSON.stringify('{"status":"unauthenticated"}'))
    }
})


router.get('/denyRequest', function (req, res, next) {
    if (req.query.id) {
        Book.denyRequest(req.query.id).then(doc => {
            res.end(JSON.stringify(doc))
        }).catch(err => {
            res.end(JSON.stringify('{"status":"error"}'))
        })
    } else {
        res.end(JSON.stringify('{"status":"unauthenticated"}'))
    }
})




var _requestSecret
router.get('/request-token', function (req, res, next) {
    twitter.getRequestToken(function (err, requestToken, requestSecret) {
        if (err)
            res.status(500).send(err)
        else {
            _requestSecret = requestSecret
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken)
        }
    });
})

//handle redirect to access token
router.get('/access-token', function (req, res, next) {
    var oauth_verifier = req.query.oauth_verifier
    var requestToken = req.query.oauth_token
    twitter.getAccessToken(requestToken, _requestSecret, oauth_verifier, function (err, accessToken, accessSecret) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            twitter.verifyCredentials(accessToken, accessSecret, function (err, user) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    console.log(user.screen_name)
                    User.createUserIfNotExist(user.screen_name, '', user.name, user.name, user.name).then(doc => {
                        req.session.user = user.screen_name
                        req.session.accessToken = accessToken
                        req.session.accessSecret = accessSecret
                        req.session.save()
                        res.redirect('/')
                    }).catch(err => {
                        console.error(err)
                    })
                }
            })
        }
    })
})

//setting



router.get('/savesetting', function (req, res, next) {
    if(req.session.user && req.query.address) {
        User.updateAddress(req.session.user, req.query.address).then(doc =>{
            res.end(JSON.stringify(doc))
        }).catch(err => {
            res.end(JSON.stringify('{"status":"error"}'))
        })
    }else{
        res.end(JSON.stringify('{"status":"unauthenticated"}'))
    }
})


router.get('/setting', function (req, res, next) {
    if(req.session.user) {
        User.find(req.session.user).then(doc => {
            res.render('setting', {address: doc.ADDRESS})
        })
    }
})


router.get('/signout', function (req, res, next) {
    if (req.session && req.session.user) {
        delete req.session.user
    }
    res.redirect('/')
})

module.exports = router