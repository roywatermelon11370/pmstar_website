var express = require('express');
var router = express.Router();
var announce = require('../models/announce');
var url = require('url');
var moment = require('moment');

router.get('/', function(req, res, next) {
    announce.
    find({}).
    sort({ 'date': -1 }).
    limit(10).
    exec(function(err, anns) {
        res.render('index', { announce: anns, title: "Express" });
    });
});
router.get('/about', function(req, res, next) {
    res.render('about');
});
router.get('/detail', function(req, res, next) {
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    if(!queryData.id) return res.redirect("/news");
    announce.
    findOne({_id: queryData.id}).
    exec(function(err, ann) {
        var curDay = new Date();
        if(ann.date > curDay) res.redirect("/news");
        else res.render('detail', { announce: ann, moment: moment });
    });
});
router.get('/qna', function(req, res, next) {
    res.render('qna');
});
router.get('/news', function(req, res, next) {
    var curDate = new Date();
    announce.
    find({date: {$lte: curDate} }).
    sort({ 'date': -1 }).
    exec(function(err, anns) {
        res.render('news', { announce: anns, moment: moment });
    });
});
router.get('/rule', function(req, res, next) {
    res.render('rule');
});
router.get('/sponsor', function(req, res, next) {
    res.render('sponsor');
});
router.get('/coOrg', function(req, res, next) {
    res.render('coOrg');
});
module.exports = router;
