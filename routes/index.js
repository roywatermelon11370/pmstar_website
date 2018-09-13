var express = require('express');
var router = express.Router();
var announce = require('../models/announce');
var url = require('url');
var moment = require('moment');

router.get('/', function(req, res, next) {
    res.render('index', { title: "首頁" });
});

router.get('/news', function(req, res, next) {
    var curDate = new Date();
    announce.
    find({date: {$lte: curDate} }).
    sort({ 'date': -1 }).
    exec(function(err, anns) {
        res.render('news', { announce: anns, moment: moment, title: "最新消息" });
    });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: "關於我們" });
});

router.get('/detail', function(req, res, next) {
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    if(!queryData.id) return res.redirect("/");
    announce.
    findOne({_id: queryData.id}).
    exec(function(err, ann) {
        var curDay = new Date();
        if(ann.date > curDay) res.redirect("/");
        else res.render('detail', { announce: ann, moment: moment, title: ann.title });
    });
});

router.get('/qna', function(req, res, next) {
    res.render('qna', { title: "常見問題" });
});

router.get('/rule', function(req, res, next) {
    res.render('rule', { title: "比賽規則" });
});

router.get('/sponsor', function(req, res, next) {
    res.render('sponsor', { title: "贊助廠商" });
});

router.get('/coOrg', function(req, res, next) {
    res.render('coOrg', { title: "協辦單位" });
});

module.exports = router;