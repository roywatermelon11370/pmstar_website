var express = require('express');
var router = express.Router();
var announce = require('../models/announce');
var jsSHA = require('jssha');
var moment = require('moment');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        var name = Date.now() + path.extname(file.originalname);
        req.body.attachment = name;
        callback(null, name);
    }
});
var upload = multer({ storage: storage });

router.post('/ann/new', upload.single('attachment'), function(req, res, next) {
    console.log("WTF!");
    console.log(req.body);
    consoel.log("WTF");
    var newAnn = new announce({
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        attachment: req.body.attachment
    });
    console.log("OAO");
    newAnn.save(function(err) {
        if (err) res.status(500).send('Error');
        else res.send('Success');
    });
});
router.post('/ann/remove', function(req, res, next) {
    if (!req.body.id)
        return res.status(500).send('No Legal Data');
    announce.remove({ _id: req.body.id }, function(err) {
        if (err) res.status(500).send('Error');
        else res.send('Success');
    });
});
router.post('/ann/update', function(req, res, next) {
    if (!req.body.id)
        return res.status(500).send('No Legal Data');
    announce.update({ _id: req.body.id }, {
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        attachment: req.body.attachment
    }, function(err) {
        if (err) res.status(500).send('Error');
        else res.send('Success');
    });
});
router.post('/login', function(req, res, next) {
    var hash = new jsSHA("SHA3-256", "TEXT");
    hash.update(String(req.body.pwd) + "ILoveKotori<3");
    if (req.body.pwd && hash.getHash("HEX") === 'be03103692a2499726bcea123167f476668730beaff55fd54021cf22af81e28d') {
        req.session.isLogin = true;
        req.session.loginFailed = 0;
    } else {
        if (!req.session.loginFailed) req.session.loginFailed = 1;
        else req.session.loginFailed += 1;
        req.flash('error', "通關密語錯誤");
    }
    res.redirect("/admin");
});
router.get('/', function(req, res, next) {
    if (req.session.isLogin) {
        announce.
        find({}).
        sort({ 'date': -1 }).
        exec(function(err, anns) {
            res.render('admin/panel', { announce: anns, moment: moment });
        });
    } else {
        res.render('admin/login', { errMsg: req.flash().error });
    }
});

module.exports = router;