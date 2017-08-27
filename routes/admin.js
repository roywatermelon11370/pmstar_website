var express = require('express');
var router = express.Router();
var reCAPTCHA = require('../models/reCAPTCHA');
var announce = require('../models/announce');
var banner = require('../models/banner');
var imagesU = require('../models/images');
var jsSHA = require('jssha');
var moment = require('moment');
var path = require('path');
var url = require('url');
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        var name = Date.now() + path.extname(file.originalname);
        req.body.link = name;
        req.body.attachment = file.originalname;
        callback(null, name);
    }
});
var upload = multer({ storage: storage });

router.post('/ann/upload', upload.single('upload'), function(req, res, next) {
    if (!req.session.isLogin) {
        return res.json({
            "uploaded": 0,
            "error": {
                "message": "請先登入，請勿繞近來亂搞！"
            }
        });
    }
    res.json({
        "uploaded": 1,
        "fileName": req.body.attachment,
        "url": url.resolve('/upload/', req.body.link)
    });
});
router.post('/ann/new', upload.single('attachment'), function(req, res, next) {
    if (!req.session.isLogin) return res.redirect("/admin");
    var newAnn = new announce({
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        attachment: req.body.link,
        attachmentName: req.body.attachment
    });
    newAnn.save(function(err) {
        if (err) res.status(500).send('Error');
        else res.send('Success');
    });
});
router.post('/ann/remove', function(req, res, next) {
    if (!req.session.isLogin) return res.redirect("/admin");
    if (!req.body.id)
        return res.status(500).send('No Legal Data');
    announce.findOne({ _id: req.body.id }, function(err, anns) {
        if (anns.attachment && anns.attachment != '') {
            fs.unlinkSync(path.join('./uploads', anns.attachment));
        }
    });
    announce.remove({ _id: req.body.id }, function(err) {
        if (err) res.status(500).send('Error');
        else res.send('Success');
    });
});
router.post('/ann/update', upload.single('attachment'), function(req, res, next) {
    if (!req.session.isLogin) return res.redirect("/admin");
    if (!req.body.id) return res.status(500).send('No Legal Data');
    if (req.body.removeFile === 'true') {
        announce.findOne({ _id: req.body.id }, function(err, anns) {
            if (anns.attachment) {
                fs.unlinkSync(path.join('./uploads', anns.attachment));
            }
        });
        announce.update({ _id: req.body.id }, {
            title: req.body.title,
            date: req.body.date,
            content: req.body.content,
            attachment: req.body.link,
            attachmentName: req.body.attachment
        }, function(err) {
            if (err) res.status(500).send('Error');
            else res.send('Success');
        });
    } else {
        announce.update({ _id: req.body.id }, {
            title: req.body.title,
            date: req.body.date,
            content: req.body.content
        }, function(err) {
            if (err) res.status(500).send('Error');
            else res.send('Success');
        });
    }

});
router.post('/login', reCAPTCHA, function(req, res, next) {
    if (req.session.loginFailed > 15) {
        return res.redirect("/");
    }
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
    if (req.session.loginFailed > 15) {
        res.redirect("/");
    } else if (req.session.isLogin) {
        res.render('admin/panel', { moment: moment });
    } else {
        res.render('admin/login', { errMsg: req.flash().error });
    }
});
router.get('/edit', function(req, res, next) {
    if (!req.session.isLogin) return res.redirect("/admin");
    announce.
    find({}).
    sort({ 'date': -1 }).
    exec(function(err, anns) {
        res.render('admin/editann', { announce: anns, moment: moment });
    });
});
router.get('/new', function(req, res, next) {
    if (!req.session.isLogin) return res.redirect("/admin");
    res.render('admin/newann', { moment: moment });

});
router.get('/logout', function(req, res, next) {
    req.session.isLogin = false;
    res.redirect("/admin");
});

module.exports = router;