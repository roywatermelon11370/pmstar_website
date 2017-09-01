var express = require('express');
var router = express.Router();
var announce = require('../models/announce');

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
    announce.
    find({}).
    sort({ 'date': -1 }).
    exec(function(err, anns) {
        res.render('detail', { announce: anns });
    });
});
router.get('/qna', function(req, res, next) {
    res.render('qna');
});
router.get('/news', function(req, res, next) {
    announce.
    find({}).
    sort({ 'date': -1 }).
    exec(function(err, anns) {
        res.render('news', { announce: anns });
    });
});
router.get('/rule', function(req, res, next) {
    res.render('rule');
});
router.get('/sponsor', function(req, res, next) {
    res.render('sponsor');
});

module.exports = router;